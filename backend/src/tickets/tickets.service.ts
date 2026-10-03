import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import * as QRCode from 'qrcode';
import { Guest, RsvpStatus } from '../guests/guest.entity';
import { Invitation } from '../invitations/invitation.entity';
import { AccessAssignment } from './access-assignment.entity';
import { User, UserRole } from '../auth/user.entity';

export interface ValidationResult {
  // valid: pase correcto y no usado. already_used: ya registró entrada.
  // not_confirmed: el invitado no confirmó asistencia. not_found: token inexistente.
  state: 'valid' | 'already_used' | 'not_confirmed';
  guestName: string;
  confirmedSeats: number;
  checkedInAt: string | null;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guests: Repository<Guest>,
    @InjectRepository(Invitation)
    private readonly invitations: Repository<Invitation>,
    @InjectRepository(AccessAssignment)
    private readonly assignments: Repository<AccessAssignment>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  // Verifica que el usuario sea dueño del evento.
  private async assertOwner(invitationId: string, userId: string): Promise<Invitation> {
    const invitation = await this.invitations.findOne({ where: { id: invitationId } });
    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }
    if (invitation.ownerId && invitation.ownerId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta invitación');
    }
    return invitation;
  }

  // Autoriza a validar: dueño del evento o staff asignado a él.
  private async assertCanValidate(invitationId: string, user: { id: string; role: UserRole }): Promise<void> {
    const invitation = await this.invitations.findOne({ where: { id: invitationId } });
    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }
    if (invitation.ownerId === user.id) {
      return;
    }
    const assigned = await this.assignments.findOne({
      where: { invitationId, userId: user.id },
    });
    if (!assigned) {
      throw new ForbiddenException('No estás autorizado para validar en este evento');
    }
  }

  // Activa o desactiva el módulo de boletos. Al activar, emite ticketToken a los
  // invitados confirmados que aún no lo tengan.
  async setTicketsEnabled(
    invitationId: string,
    userId: string,
    enabled: boolean,
  ): Promise<{ ticketsEnabled: boolean; issued: number }> {
    const invitation = await this.assertOwner(invitationId, userId);
    invitation.ticketsEnabled = enabled;
    await this.invitations.save(invitation);

    let issued = 0;
    if (enabled) {
      const confirmed = await this.guests.find({
        where: { invitationId, rsvpStatus: RsvpStatus.Confirmed },
      });
      for (const g of confirmed) {
        if (!g.ticketToken) {
          g.ticketToken = randomBytes(18).toString('hex');
          await this.guests.save(g);
          issued += 1;
        }
      }
    }
    return { ticketsEnabled: enabled, issued };
  }

  // Pase del invitado: datos + imagen QR (data URL) que apunta al enlace de validación.
  // Si los boletos no están activos o el invitado no confirmó, no hay pase.
  async getGuestPass(accessToken: string): Promise<{
    hasPass: boolean;
    guestName?: string;
    seats?: number;
    qrDataUrl?: string;
    reason?: string;
  }> {
    const guest = await this.guests.findOne({ where: { accessToken } });
    if (!guest) {
      throw new NotFoundException('Invitación no encontrada');
    }
    const invitation = await this.invitations.findOne({ where: { id: guest.invitationId } });
    if (!invitation?.ticketsEnabled) {
      return { hasPass: false, reason: 'tickets_disabled' };
    }
    if (guest.rsvpStatus !== RsvpStatus.Confirmed) {
      return { hasPass: false, reason: 'not_confirmed' };
    }
    // Emite el token del pase si aún no existe (p. ej. confirmó después de activar).
    if (!guest.ticketToken) {
      guest.ticketToken = randomBytes(18).toString('hex');
      await this.guests.save(guest);
    }

    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:4300';
    const validateUrl = `${frontendUrl}/validar/${guest.ticketToken}`;
    const qrDataUrl = await QRCode.toDataURL(validateUrl, { margin: 1, width: 240 });

    return {
      hasPass: true,
      guestName: guest.name,
      seats: guest.confirmedSeats,
      qrDataUrl,
    };
  }

  // Consulta el estado de un pase (sin registrar entrada). Para la pantalla del staff.
  async inspect(ticketToken: string, user: { id: string; role: UserRole }): Promise<ValidationResult> {
    const guest = await this.guests.findOne({ where: { ticketToken } });
    if (!guest) {
      throw new NotFoundException('Pase no encontrado');
    }
    await this.assertCanValidate(guest.invitationId, user);
    return this.toResult(guest);
  }

  // Registra la entrada. Idempotente: si ya ingresó, informa 'already_used'.
  async checkIn(ticketToken: string, user: { id: string; role: UserRole }): Promise<ValidationResult> {
    const guest = await this.guests.findOne({ where: { ticketToken } });
    if (!guest) {
      throw new NotFoundException('Pase no encontrado');
    }
    await this.assertCanValidate(guest.invitationId, user);

    if (guest.rsvpStatus !== RsvpStatus.Confirmed) {
      throw new BadRequestException('El invitado no confirmó asistencia');
    }
    if (guest.checkedInAt) {
      return this.toResult(guest); // ya usado: no vuelve a marcar
    }
    // Primer ingreso: registra la entrada y responde 'valid'.
    guest.checkedInAt = new Date();
    await this.guests.save(guest);
    return {
      state: 'valid',
      guestName: guest.name,
      confirmedSeats: guest.confirmedSeats,
      checkedInAt: guest.checkedInAt.toISOString(),
    };
  }

  // Asigna un usuario (por correo) como personal de acceso del evento.
  async assignStaff(invitationId: string, ownerId: string, email: string): Promise<AccessAssignment> {
    await this.assertOwner(invitationId, ownerId);
    const user = await this.users.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      throw new NotFoundException('No existe un usuario con ese correo');
    }
    // Marca al usuario como staff si aún no lo es (no degrada a un admin).
    if (user.role === UserRole.Organizer) {
      user.role = UserRole.Staff;
      await this.users.save(user);
    }
    const existing = await this.assignments.findOne({
      where: { invitationId, userId: user.id },
    });
    if (existing) {
      return existing;
    }
    return this.assignments.save(
      this.assignments.create({ invitationId, userId: user.id }),
    );
  }

  private toResult(guest: Guest): ValidationResult {
    const state =
      guest.rsvpStatus !== RsvpStatus.Confirmed
        ? 'not_confirmed'
        : guest.checkedInAt
          ? 'already_used'
          : 'valid';
    return {
      state,
      guestName: guest.name,
      confirmedSeats: guest.confirmedSeats,
      checkedInAt: guest.checkedInAt ? guest.checkedInAt.toISOString() : null,
    };
  }
}
