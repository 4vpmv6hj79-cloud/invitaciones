import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import sharp from 'sharp';
import { Invitation, InvitationStatus } from './invitation.entity';
import { Event } from './event.entity';
import { TemplateDefinition } from '../templates/template.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitations: Repository<Invitation>,
    @InjectRepository(Event)
    private readonly events: Repository<Event>,
    @InjectRepository(TemplateDefinition)
    private readonly templates: Repository<TemplateDefinition>,
  ) {}

  // Crea una invitación-borrador a partir de una plantilla.
  // Copia el theme de la plantilla como punto de partida de la personalización.
  // ownerId es el organizador autenticado dueño de la invitación.
  async createDraft(dto: CreateInvitationDto, ownerId: string): Promise<Invitation> {
    const template = await this.templates.findOne({ where: { id: dto.templateId } });
    if (!template) {
      throw new NotFoundException('Plantilla no encontrada');
    }

    const event = this.events.create({
      type: template.eventTypes[0],
      title: dto.title ?? '',
      data: {},
    });

    const invitation = this.invitations.create({
      templateId: template.id,
      ownerId,
      event,
      // La personalización arranca como copia del theme de la plantilla.
      customization: { ...template.theme },
    });

    return this.invitations.save(invitation);
  }

  async findOne(id: string): Promise<Invitation> {
    const invitation = await this.invitations.findOne({ where: { id } });
    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }
    return invitation;
  }

  // Igual que findOne pero verifica que el usuario sea el dueño (separación de datos).
  async findOwned(id: string, ownerId: string): Promise<Invitation> {
    const invitation = await this.findOne(id);
    if (invitation.ownerId && invitation.ownerId !== ownerId) {
      throw new ForbiddenException('No tienes acceso a esta invitación');
    }
    return invitation;
  }

  // Lista las invitaciones del organizador (dashboard "mis invitaciones").
  async listByOwner(ownerId: string): Promise<Invitation[]> {
    return this.invitations.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  // Guarda el borrador: título y contenido del evento + personalización del diseño.
  // Verifica propiedad antes de modificar.
  async update(id: string, dto: UpdateInvitationDto, ownerId: string): Promise<Invitation> {
    const invitation = await this.findOwned(id, ownerId);

    if (dto.title !== undefined) {
      invitation.event.title = dto.title;
    }
    if (dto.eventData) {
      // Mezcla con el contenido existente para no perder campos no enviados.
      invitation.event.data = { ...invitation.event.data, ...dto.eventData };
    }
    if (dto.customization) {
      invitation.customization = { ...invitation.customization, ...dto.customization };
    }

    // event tiene cascade: se guarda junto con la invitación.
    await this.events.save(invitation.event);
    return this.invitations.save(invitation);
  }

  // Publica la invitación: genera enlace público y vigencia. Idempotente:
  // si ya está publicada, conserva el token existente.
  async publish(id: string, validityDays: number): Promise<Invitation> {
    const invitation = await this.findOne(id);
    if (invitation.status !== InvitationStatus.Published) {
      invitation.status = InvitationStatus.Published;
      invitation.publicToken = randomBytes(24).toString('hex');
      invitation.publishedAt = new Date();
      const expires = new Date();
      expires.setDate(expires.getDate() + validityDays);
      invitation.expiresAt = expires;
      await this.invitations.save(invitation);
    }
    return invitation;
  }

  // Busca la invitación publicada por token (uso interno: imagen y metadatos).
  async getPublishedByToken(token: string): Promise<Invitation> {
    const invitation = await this.invitations.findOne({
      where: { publicToken: token, status: InvitationStatus.Published },
    });
    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }
    return invitation;
  }

  // Genera una imagen SVG para compartir, con los datos de la invitación.
  // Usa solo formas y tipografías del sistema (sin recursos con licencia de pago).
  async buildShareSvg(token: string): Promise<string> {
    const inv = await this.getPublishedByToken(token);
    const c = inv.customization as Record<string, string>;
    const d = inv.event.data as Record<string, string>;

    const bg = c.background || '#faf7ef';
    const primary = c.primary || '#b8860b';
    const secondary = c.secondary || '#7a5c13';
    const title = this.escapeXml(inv.event.title || 'Invitación');
    const names = this.escapeXml(d.coupleOrHonoree || '');
    const when = this.escapeXml(
      [d.date, d.time ? `${d.time} h` : ''].filter(Boolean).join(' · '),
    );
    const where = this.escapeXml(d.locationName || '');

    // 1200x630: proporción recomendada para vistas previas en redes.
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="${primary}" stroke-width="3" rx="16"/>
  <text x="600" y="200" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${secondary}" letter-spacing="4">TE INVITAMOS A</text>
  <text x="600" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="${primary}">${title}</text>
  ${names ? `<text x="600" y="370" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="${secondary}">${names}</text>` : ''}
  <line x1="520" y1="410" x2="680" y2="410" stroke="${primary}" stroke-width="2"/>
  ${when ? `<text x="600" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${secondary}">${when}</text>` : ''}
  ${where ? `<text x="600" y="520" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="${secondary}">${where}</text>` : ''}
</svg>`;
  }

  // Rasteriza el SVG de compartir a PNG (1200x630) para vistas previas en redes.
  async buildSharePng(token: string): Promise<Buffer> {
    const svg = await this.buildShareSvg(token);
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Datos públicos de la invitación publicada, por token.
  // No expone ids internos, pedidos ni (futura) lista de invitados.
  async findPublicByToken(token: string): Promise<{
    title: string;
    eventType: string;
    data: Record<string, unknown>;
    customization: Record<string, unknown>;
    expired: boolean;
  }> {
    const invitation = await this.invitations.findOne({
      where: { publicToken: token, status: InvitationStatus.Published },
    });
    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }
    const expired = invitation.expiresAt ? invitation.expiresAt < new Date() : false;
    return {
      title: invitation.event.title,
      eventType: invitation.event.type,
      data: invitation.event.data,
      customization: invitation.customization,
      expired,
    };
  }
}
