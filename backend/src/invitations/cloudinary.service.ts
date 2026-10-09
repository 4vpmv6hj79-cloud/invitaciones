import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

/**
 * Servicio que sube imágenes a Cloudinary (almacenamiento permanente).
 *
 * Se configura con tres variables de entorno (definidas en Render):
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * Si no están configuradas, isConfigured() devuelve false y el controlador
 * cae de vuelta al almacenamiento en disco local (útil en desarrollo).
 */
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly configured: boolean;

  constructor(config: ConfigService) {
    // Se recortan espacios por si al pegar la variable en Render quedó algún espacio.
    const cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME')?.trim();
    const apiKey = config.get<string>('CLOUDINARY_API_KEY')?.trim();
    const apiSecret = config.get<string>('CLOUDINARY_API_SECRET')?.trim();

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (this.configured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      // No se registran valores sensibles, solo el cloud name para diagnóstico.
      this.logger.log(`Cloudinary configurado (cloud: ${cloudName}).`);
    } else {
      this.logger.warn(
        'Cloudinary NO está configurado. Faltan variables: ' +
          [
            cloudName ? null : 'CLOUDINARY_CLOUD_NAME',
            apiKey ? null : 'CLOUDINARY_API_KEY',
            apiSecret ? null : 'CLOUDINARY_API_SECRET',
          ]
            .filter(Boolean)
            .join(', ') +
          '. Se usará almacenamiento local (efímero en Render).',
      );
    }
  }

  // Indica si Cloudinary está disponible (variables presentes).
  isConfigured(): boolean {
    return this.configured;
  }

  /**
   * Sube el buffer de una imagen a Cloudinary y devuelve la URL pública (https).
   * Las imágenes se agrupan en la carpeta "invitaciones".
   */
  uploadImage(buffer: Buffer): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let settled = false;

      // Red de seguridad: si Cloudinary no responde en 30s, se rechaza con un
      // error claro para que la subida no quede colgada indefinidamente.
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        this.logger.error('La subida a Cloudinary excedió el tiempo de espera (30s).');
        reject(new Error('La subida a Cloudinary tardó demasiado; inténtalo de nuevo.'));
      }, 30_000);

      const stream = cloudinary.uploader.upload_stream(
        { folder: 'invitaciones', resource_type: 'image' },
        (error, result?: UploadApiResponse) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (error || !result) {
            const detail =
              (error as { message?: string } | undefined)?.message ??
              JSON.stringify(error) ??
              'sin resultado';
            this.logger.error(`Error al subir a Cloudinary: ${detail}`);
            reject(new Error(detail));
            return;
          }
          resolve(result.secure_url);
        },
      );

      stream.on('error', (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        this.logger.error(`Error de stream hacia Cloudinary: ${err?.message ?? err}`);
        reject(err);
      });

      stream.end(buffer);
    });
  }
}
