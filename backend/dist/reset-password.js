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
    const email = (process.argv[2] ?? '').toLowerCase().trim();
    const newPassword = process.argv[3] ?? '';
    if (!email || !newPassword) {
        console.error('Uso: node dist/reset-password.js correo@ejemplo.com "NuevaContraseña"');
        process.exit(1);
    }
    if (newPassword.length < 8) {
        console.error('La contraseña debe tener al menos 8 caracteres.');
        process.exit(1);
    }
    if (newPassword.length > 72) {
        console.error('La contraseña no debe exceder 72 caracteres.');
        process.exit(1);
    }
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const users = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        const user = await users.findOne({ where: { email } });
        if (!user) {
            console.log(`• ${email}: no existe ninguna cuenta con ese correo.`);
            process.exit(1);
        }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await users.save(user);
        console.log(`✓ ${email}: contraseña restablecida. Ya puedes iniciar sesión con la nueva contraseña.`);
    }
    finally {
        await app.close();
    }
}
run().catch((err) => {
    console.error('Error al restablecer la contraseña:', err);
    process.exit(1);
});
//# sourceMappingURL=reset-password.js.map