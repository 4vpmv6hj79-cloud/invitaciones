import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

/**
 * Servicio de envío de correos.
 *
 * Si RESEND_API_KEY está configurada, envía correos reales con Resend.
 * Si no, opera en "modo sin correo": no envía nada, pero registra en los logs
 * el enlace generado para diagnóstico (útil mientras no hay servicio de correo).
 *
 * Variables de entorno:
 *   RESEND_API_KEY  - API key de Resend (habilita el envío real)
 *   MAIL_FROM       - remitente, ej. "Invitaciones <noreply@tudominio.com>"
 *                     (por defecto usa el dominio de pruebas de Resend)
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('RESEND_API_KEY')?.trim();
    this.from =
      config.get<string>('MAIL_FROM')?.trim() || 'Invitaciones <onboarding@resend.dev>';
    this.resend = apiKey ? new Resend(apiKey) : null;

    if (this.resend) {
      this.logger.log(`Servicio de correo activo (remitente: ${this.from}).`);
    } else {
      this.logger.warn(
        'RESEND_API_KEY no configurada: los correos NO se envían (modo sin correo).',
      );
    }
  }

  get isEnabled(): boolean {
    return this.resend !== null;
  }

  /**
   * Envía el correo de recuperación de contraseña.
   * En modo sin correo, solo registra el enlace en los logs y no falla.
   */
  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
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
      // Modo sin correo: no se envía, pero dejamos rastro para diagnóstico.
      this.logger.warn(
        `[modo sin correo] Enlace de recuperación para ${to}: ${resetUrl}`,
      );
      return;
    }

    try {
      await this.resend.emails.send({ from: this.from, to, subject, html });
      this.logger.log(`Correo de recuperación enviado a ${to}.`);
    } catch (e) {
      const detail = (e as { message?: string })?.message ?? 'error desconocido';
      this.logger.error(`No se pudo enviar el correo de recuperación a ${to}: ${detail}`);
      // No relanzamos: el endpoint responde igual para no revelar si el correo existe.
    }
  }
}
