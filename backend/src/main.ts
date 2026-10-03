import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // rawBody: true permite leer el cuerpo crudo para verificar la firma del webhook de Stripe.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const config = app.get(ConfigService);

  // Sirve las imágenes subidas (desarrollo). En producción esto iría a un object storage/CDN.
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // Validación global de DTOs: descarta campos no declarados y transforma tipos.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS para permitir el frontend Angular.
  // CORS_ORIGIN puede ser una lista separada por comas (dev local + dominio de Vercel).
  const corsOrigin = config.get<string>('CORS_ORIGIN') ?? 'http://localhost:4200';
  const allowedOrigins = corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);
  app.enableCors({ origin: allowedOrigins });

  // Railway (y la mayoría de PaaS) inyecta el puerto por la variable PORT.
  // Hay que escuchar en 0.0.0.0 para aceptar conexiones externas al contenedor.
  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`Backend escuchando en el puerto ${port}`);
}

bootstrap();
