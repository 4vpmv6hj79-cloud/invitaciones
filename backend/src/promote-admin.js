"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var app_module_1 = require("./app.module");
var user_entity_1 = require("./auth/user.entity");
// Promueve usuarios a administrador (o los crea como admin si no existen).
//
// Uso:
//   npm run promote-admin -- correo1@ejemplo.com correo2@ejemplo.com
//
// Si una cuenta no existe todavía, se crea como admin con la contraseña
// definida en la variable de entorno ADMIN_DEFAULT_PASSWORD (si está presente).
// Si la cuenta ya existe, solo se cambia su rol a admin (no se toca su contraseña).
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var emails, app, users, defaultPassword, _i, emails_1, email, existing, passwordHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emails = process.argv.slice(2).map(function (e) { return e.toLowerCase().trim(); }).filter(Boolean);
                    if (emails.length === 0) {
                        // eslint-disable-next-line no-console
                        console.error('Debes indicar al menos un correo. Ej: npm run promote-admin -- correo@ejemplo.com');
                        process.exit(1);
                    }
                    return [4 /*yield*/, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 11, 13]);
                    users = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
                    defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
                    _i = 0, emails_1 = emails;
                    _a.label = 3;
                case 3:
                    if (!(_i < emails_1.length)) return [3 /*break*/, 10];
                    email = emails_1[_i];
                    return [4 /*yield*/, users.findOne({ where: { email: email } })];
                case 4:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 6];
                    existing.role = user_entity_1.UserRole.Admin;
                    return [4 /*yield*/, users.save(existing)];
                case 5:
                    _a.sent();
                    // eslint-disable-next-line no-console
                    console.log("\u2713 ".concat(email, ": cuenta existente promovida a ADMIN."));
                    return [3 /*break*/, 9];
                case 6:
                    if (!defaultPassword) {
                        // eslint-disable-next-line no-console
                        console.log("\u2022 ".concat(email, ": no existe. P\u00EDdele que se registre primero, o define ADMIN_DEFAULT_PASSWORD para crearla como admin."));
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, bcrypt.hash(defaultPassword, 10)];
                case 7:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, users.save(users.create({
                            email: email,
                            passwordHash: passwordHash,
                            name: email.split('@')[0],
                            role: user_entity_1.UserRole.Admin,
                        }))];
                case 8:
                    _a.sent();
                    // eslint-disable-next-line no-console
                    console.log("\u2713 ".concat(email, ": cuenta creada como ADMIN con la contrase\u00F1a temporal indicada."));
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    // eslint-disable-next-line no-console
                    console.log('Listo. Los usuarios promovidos deben cerrar sesión y volver a entrar para obtener un token con rol admin.');
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, app.close()];
                case 12:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
run().catch(function (err) {
    // eslint-disable-next-line no-console
    console.error('Error al promover administradores:', err);
    process.exit(1);
});
