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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    constructor(config) {
        this.logger = new common_1.Logger(MailService_1.name);
        const apiKey = config.get('RESEND_API_KEY')?.trim();
        this.from =
            config.get('MAIL_FROM')?.trim() || 'Invitaciones <onboarding@resend.dev>';
        this.resend = apiKey ? new resend_1.Resend(apiKey) : null;
        if (this.resend) {
            this.logger.log(`Servicio de correo activo (remitente: ${this.from}).`);
        }
        else {
            this.logger.warn('RESEND_API_KEY no configurada: los correos NO se envían (modo sin correo).');
        }
    }
    get isEnabled() {
        return this.resend !== null;
    }
    async sendPasswordReset(to, resetUrl) {
        const subject = 'Recupera tu contraseña';
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #333;">
        <h2 style="color: #b8860b;">Recupera tu contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente botón para elegir una nueva. Este enlace vence en 1 hora.</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="background: #b8860b; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Restablecer contraseña
          </a>
        </p>
        <p style="font-size: 13px; color: #777;">
          Si no solicitaste este cambio, puedes ignorar este correo; tu contraseña no cambiará.
        </p>
      </div>
    `;
        if (!this.resend) {
            this.logger.warn(`[modo sin correo] Enlace de recuperación para ${to}: ${resetUrl}`);
            return;
        }
        try {
            await this.resend.emails.send({ from: this.from, to, subject, html });
            this.logger.log(`Correo de recuperación enviado a ${to}.`);
        }
        catch (e) {
            const detail = e?.message ?? 'error desconocido';
            this.logger.error(`No se pudo enviar el correo de recuperación a ${to}: ${detail}`);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map