import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TemplatesService } from './templates/templates.service';

// Script de siembra del catálogo inicial.
// Uso: npm run seed
async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const templates = app.get(TemplatesService);
    const result = await templates.seed();
    // eslint-disable-next-line no-console
    console.log(
      `Seed completado: ${result.inserted} plantillas nuevas. Total en catálogo: ${result.total}.`,
    );
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error al sembrar:', err);
  process.exit(1);
});
