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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const app_module_1 = require("./app.module");
const user_entity_1 = require("./auth/user.entity");
async function run() {
    const emails = process.argv.slice(2).map((e) => e.toLowerCase().trim()).filter(Boolean);
    if (emails.length === 0) {
        console.error('Debes indicar al menos un correo. Ej: npm run promote-admin -- correo@ejemplo.com');
        process.exit(1);
    }
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const users = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
        for (const email of emails) {
            const existing = await users.findOne({ where: { email } });
            if (existing) {
                existing.role = user_entity_1.UserRole.Admin;
                await users.save(existing);
                console.log(`✓ ${email}: cuenta existente promovida a ADMIN.`);
                continue;
            }
            if (!defaultPassword) {
                console.log(`• ${email}: no existe. Pídele que se registre primero, o define ADMIN_DEFAULT_PASSWORD para crearla como admin.`);
                continue;
            }
            const passwordHash = await bcrypt.hash(defaultPassword, 10);
            await users.save(users.create({
                email,
                passwordHash,
                name: email.split('@')[0],
                role: user_entity_1.UserRole.Admin,
            }));
            console.log(`✓ ${email}: cuenta creada como ADMIN con la contraseña temporal indicada.`);
        }
        console.log('Listo. Los usuarios promovidos deben cerrar sesión y volver a entrar para obtener un token con rol admin.');
    }
    finally {
        await app.close();
    }
}
run().catch((err) => {
    console.error('Error al promover administradores:', err);
    process.exit(1);
});
//# sourceMappingURL=promote-admin.js.map