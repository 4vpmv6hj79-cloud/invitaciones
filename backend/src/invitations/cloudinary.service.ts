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
    const cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = config.get<string>('CLOUDINARY_API_SECRET');

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (this.configured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    } else {
      this.logger.warn(
        'Cloudinary no está configurado (faltan variables de entorno); se usará almacenamiento local.',
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
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'invitaciones', resource_type: 'image' },
        (error, result?: UploadApiResponse) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary no devolvió resultado'));
            return;
          }
          resolve(result.secure_url);
        },
      );
      stream.end(buffer);
    });
  }
}
