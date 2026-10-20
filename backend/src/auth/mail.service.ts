import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Servicio de envío de correos por SMTP (Gmail u otro proveedor SMTP).
 *
 * Si SMTP_HOST/SMTP_USER/SMTP_PASSWORD están configurados, envía correos reales.
 * Si no, opera en "modo sin correo": no envía nada, pero registra en los logs
 * el enlace generado (útil para diagnóstico mientras no hay SMTP configurado).
 *
 * Variables de entorno (para Gmail):
 *   SMTP_HOST     - smtp.gmail.com
 *   SMTP_PORT     - 465 (SSL) o 587 (STARTTLS). Por defecto 465.
 *   SMTP_USER     - tu correo de Gmail
 *   SMTP_PASSWORD - contraseña de aplicación de Google (16 caracteres)
 *   MAIL_FROM     - remitente mostrado, ej. "Invitaciones <tucorreo@gmail.com>"
 *                   (si no se indica, usa SMTP_USER)
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;

  constructor(config: ConfigService) {
    const host = config.get<string>('SMTP_HOST')?.trim();
    const user = config.get<string>('SMTP_USER')?.trim();
    const password = config.get<string>('SMTP_PASSWORD')?.trim();
    const port = Number(config.get<string>('SMTP_PORT')?.trim() || 465);

    this.from =
      config.get<string>('MAIL_FROM')?.trim() ||
      (user ? `Invitaciones <${user}>` : 'Invitaciones <no-reply@localhost>');

    if (host && user && password) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        // 465 usa SSL directo (secure: true); 587 usa STARTTLS (secure: false).
        secure: port === 465,
        auth: { user, pass: password },
        // Tiempos de espera acotados: si el puerto está bloqueado, falla rápido
        // en vez de colgar la petición. (Render Free suele bloquear el 465;
        // se recomienda SMTP_PORT=587.)
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
      this.logger.log(
        `Servicio de correo SMTP activo (host: ${host}, puerto: ${port}, remitente: ${this.from}).`,
      );
    } else {
      this.transporter = null;
      this.logger.warn(
        'SMTP no configurado (faltan SMTP_HOST/SMTP_USER/SMTP_PASSWORD): los correos NO se envían (modo sin correo).',
      );
    }
  }

  get isEnabled(): boolean {
    return this.transporter !== null;
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

    if (!this.transporter) {
      // Modo sin correo: no se envía, pero dejamos rastro para diagnóstico.
      this.logger.warn(`[modo sin correo] Enlace de recuperación para ${to}: ${resetUrl}`);
      return;
    }

    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
      this.logger.log(`Correo de recuperación enviado a ${to}.`);
    } catch (e) {
      const detail = (e as { message?: string })?.message ?? 'error desconocido';
      this.logger.error(`No se pudo enviar el correo de recuperación a ${to}: ${detail}`);
      // No relanzamos: el endpoint responde igual para no revelar si el correo existe.
    }
  }
}
