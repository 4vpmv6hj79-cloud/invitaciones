"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const security_reset_dto_1 = require("./dto/security-reset.dto");
const decorators_1 = require("./decorators");
const security_questions_1 = require("./security-questions");
let AuthController = class AuthController {
    constructor(service) {
        this.service = service;
    }
    register(dto) {
        return this.service.register(dto);
    }
    login(dto) {
        return this.service.login(dto);
    }
    async forgotPassword(dto) {
        await this.service.forgotPassword(dto.email);
        return {
            ok: true,
            message: 'Si el correo está registrado, enviaremos un enlace para restablecer la contraseña.',
        };
    }
    async resetPassword(dto) {
        await this.service.resetPassword(dto.token, dto.password);
        return { ok: true, message: 'Tu contraseña se actualizó. Ya puedes iniciar sesión.' };
    }
    securityQuestions() {
        return security_questions_1.SECURITY_QUESTIONS;
    }
    getSecurityQuestion(dto) {
        return this.service.getSecurityQuestion(dto.email);
    }
    async securityReset(dto) {
        await this.service.resetWithSecurityAnswer(dto.email, dto.answer, dto.password);
        return { ok: true, message: 'Tu contraseña se actualizó. Ya puedes iniciar sesión.' };
    }
    me(user) {
        return this.service.findById(user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)('security-questions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "securityQuestions", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('security-question'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [security_reset_dto_1.SecurityQuestionLookupDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getSecurityQuestion", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('security-reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [security_reset_dto_1.SecurityResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "securityReset", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map