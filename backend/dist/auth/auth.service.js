"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./user.entity");
const mail_service_1 = require("./mail.service");
let AuthService = class AuthService {
    constructor(users, jwt, config, mail) {
        this.users = users;
        this.jwt = jwt;
        this.config = config;
        this.mail = mail;
    }
    async register(dto) {
        const email = dto.email.toLowerCase().trim();
        const exists = await this.users.findOne({ where: { email } });
        if (exists) {
            throw new common_1.ConflictException('Ya existe una cuenta con ese correo');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.users.save(this.users.create({
            email,
            passwordHash,
            name: dto.name,
            role: user_entity_1.UserRole.Organizer,
        }));
        return this.buildResult(user);
    }
    async login(dto) {
        const email = dto.email.toLowerCase().trim();
        const user = await this.users.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Correo o contraseña incorrectos');
        }
        return this.buildResult(user);
    }
    async findById(id) {
        const user = await this.users.findOne({ where: { id } });
        return user ? this.toPublic(user) : null;
    }
    async forgotPassword(emailRaw) {
        const email = emailRaw.toLowerCase().trim();
        const user = await this.users.findOne({ where: { email } });
        if (!user) {
            return;
        }
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
        user.resetTokenHash = this.hashToken(rawToken);
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        user.resetTokenExpires = expires;
        await this.users.save(user);
        const frontendUrl = this.config.get('FRONTEND_URL')?.trim() || 'http://localhost:4300';
        const resetUrl = `${frontendUrl}/restablecer?token=${rawToken}`;
        await this.mail.sendPasswordReset(email, resetUrl);
    }
    async resetPassword(rawToken, newPassword) {
        const tokenHash = this.hashToken(rawToken);
        const user = await this.users.findOne({
            where: { resetTokenHash: tokenHash, resetTokenExpires: (0, typeorm_2.MoreThan)(new Date()) },
        });
        if (!user) {
            throw new common_1.BadRequestException('El enlace de recuperación no es válido o ya expiró.');
        }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        user.resetTokenHash = null;
        user.resetTokenExpires = null;
        await this.users.save(user);
    }
    hashToken(rawToken) {
        return (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
    }
    buildResult(user) {
        const payload = { sub: user.id, role: user.role, email: user.email };
        const token = this.jwt.sign(payload);
        return { token, user: this.toPublic(user) };
    }
    toPublic(user) {
        return { id: user.id, email: user.email, name: user.name, role: user.role };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map