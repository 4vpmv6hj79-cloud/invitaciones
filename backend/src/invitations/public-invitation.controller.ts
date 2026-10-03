import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { InvitationsService } from './invitations.service';
import { Public } from '../auth/decorators';

// Acceso público a una invitación publicada, por token opaco.
// No expone ids internos, pedidos ni datos sensibles.
@Public()
@Controller('p')
export class PublicInvitationController {
  constructor(
    private readonly service: InvitationsService,
    private readonly config: ConfigService,
  ) {}

  // GET /p/:token  -> datos públicos para renderizar la invitación del invitado (JSON).
  @Get(':token')
  findByToken(@Param('token') token: string) {
    return this.service.findPublicByToken(token);
  }

  // GET /p/:token/image.svg -> imagen SVG para compartir.
  @Get(':token/image.svg')
  @Header('Content-Type', 'image/svg+xml')
  @Header('Cache-Control', 'public, max-age=300')
  async image(@Param('token') token: string): Promise<string> {
    return this.service.buildShareSvg(token);
  }

  // GET /p/:token/image.png -> imagen PNG para compartir (preferida por WhatsApp/redes).
  @Get(':token/image.png')
  @Header('Content-Type', 'image/png')
  @Header('Cache-Control', 'public, max-age=300')
  async imagePng(@Param('token') token: string, @Res() res: Response): Promise<void> {
    const buffer = await this.service.buildSharePng(token);
    res.send(buffer);
  }

  // GET /p/:token/share -> HTML con metadatos Open Graph para la vista previa al compartir.
  // Los crawlers de WhatsApp/redes leen estos meta tags; un visitante real es redirigido a la app.
  @Get(':token/share')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async share(@Param('token') token: string, @Res() res: Response): Promise<void> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:4300';
    const backendUrl = this.config.get<string>('PUBLIC_API_URL') ?? 'http://localhost:3100';

    let title = 'Invitación';
    let description = 'Te invitamos a nuestro evento';
    try {
      const data = await this.service.findPublicByToken(token);
      title = data.title || title;
      const d = data.data as Record<string, string>;
      description = [d.coupleOrHonoree, d.date].filter(Boolean).join(' · ') || description;
    } catch {
      // Si no existe, servimos metadatos genéricos (sin filtrar el error).
    }

    const safeTitle = this.escapeHtml(title);
    const safeDesc = this.escapeHtml(description);
    // Open Graph: PNG (mejor compatibilidad con WhatsApp/redes que SVG).
    const imageUrl = `${backendUrl}/p/${encodeURIComponent(token)}/image.png`;
    const appUrl = `${frontendUrl}/i/${encodeURIComponent(token)}`;

    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${safeTitle}</title>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${safeTitle}"/>
<meta property="og:description" content="${safeDesc}"/>
<meta property="og:image" content="${imageUrl}"/>
<meta property="og:url" content="${appUrl}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta http-equiv="refresh" content="0; url=${appUrl}"/>
</head>
<body>
<p>Redirigiendo a la invitación… <a href="${appUrl}">Abrir invitación</a></p>
</body>
</html>`);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
