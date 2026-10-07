import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Guest, RsvpStatus, GuestRsvpMode } from './guest.entity';
import { GuestGroup } from './guest-group.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { RsvpDto } from './dto/rsvp.dto';
import { InvitationsService } from '../invitations/invitations.service';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guests: Repository<Guest>,
    @InjectRepository(GuestGroup)
    private readonly groups: Repository<GuestGroup>,
    private readonly invitations: InvitationsService,
  ) {}

  // Verifica que el usuario sea dueño de la invitación antes de gestionar invitados.
  async assertOwner(invitationId: string, ownerId: string): Promise<void> {
    await this.invitations.findOwned(invitationId, ownerId);
  }

  // ---- Organizador ----

  async createGuest(invitationId: string, dto: CreateGuestDto): Promise<Guest> {
    const guest = this.guests.create({
      invitationId,
      name: dto.name,
      contact: dto.contact ?? null,
      allowedSeats: dto.allowedSeats,
      rsvpMode: dto.rsvpMode === 'cerrado' ? GuestRsvpMode.Cerrado : GuestRsvpMode.Abierto,
      groupId: dto.groupId ?? null,
      accessToken: randomBytes(18).toString('hex'),
    });
    return this.guests.save(guest);
  }

  async createGroup(invitationId: string, dto: CreateGroupDto): Promise<GuestGroup> {
    const group = this.groups.create({
      invitationId,
      name: dto.name,
      allowedSeats: dto.allowedSeats,
    });
    return this.groups.save(group);
  }

  async listGuests(invitationId: string): Promise<Guest[]> {
    return this.guests.find({
      where: { invitationId },
      order: { createdAt: 'ASC' },
    });
  }

  // Resumen de confirmaciones para el panel del organizador.
  async summary(invitationId: string): Promise<{
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
    seatsConfirmed: number;
    seatsAllowed: number;
  }> {
    const guests = await this.listGuests(invitationId);
    return {
      total: guests.length,
      confirmed: guests.filter((g) => g.rsvpStatus === RsvpStatus.Confirmed).length,
      declined: guests.filter((g) => g.rsvpStatus === RsvpStatus.Declined).length,
      pending: guests.filter((g) => g.rsvpStatus === RsvpStatus.Pending).length,
      seatsConfirmed: guests.reduce((sum, g) => sum + g.confirmedSeats, 0),
      seatsAllowed: guests.reduce((sum, g) => sum + g.allowedSeats, 0),
    };
  }

  async removeGuest(invitationId: string, guestId: string): Promise<void> {
    const guest = await this.guests.findOne({ where: { id: guestId, invitationId } });
    if (!guest) {
      throw new NotFoundException('Invitado no encontrado');
    }
    await this.guests.remove(guest);
  }

  // ---- Invitado (enlace privado por token) ----

  // Datos mínimos del invitado para su enlace privado. No expone a otros invitados.
  async getByToken(token: string): Promise<Guest> {
    const guest = await this.guests.findOne({ where: { accessToken: token } });
    if (!guest) {
      throw new NotFoundException('Invitación no encontrada');
    }
    return guest;
  }

  // ---- RSVP público (enlace compartido /i/:token) ----

  // Confirma asistencia desde el enlace público general: crea un invitado
  // auto-registrado en la invitación publicada. Así un solo enlace sirve para
  // todos los invitados, que confirman poniendo su nombre.
  async publicRsvp(
    publicToken: string,
    data: { name: string; seats?: number; dietaryNotes?: string; status?: 'confirmed' | 'declined' },
  ): Promise<{ ok: true; status: string }> {
    // Valida que la invitación exista, esté publicada y no haya expirado.
    const invitation = await this.invitations.getPublishedByToken(publicToken);
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      throw new BadRequestException('Esta invitación ya no está disponible');
    }

    const name = (data.name ?? '').trim();
    if (!name) {
      throw new BadRequestException('Escribe tu nombre para confirmar');
    }

    const declined = data.status === 'declined';
    const seats = declined ? 0 : Math.max(1, Number(data.seats) || 1);

    const guest = this.guests.create({
      invitationId: invitation.id,
      name,
      contact: null,
      // Auto-registrado: autorizamos los lugares que indica (no hay tope previo).
      allowedSeats: declined ? 1 : seats,
      confirmedSeats: seats,
      rsvpStatus: declined ? RsvpStatus.Declined : RsvpStatus.Confirmed,
      dietaryNotes: data.dietaryNotes?.trim() || null,
      accessToken: randomBytes(18).toString('hex'),
      respondedAt: new Date(),
    });
    await this.guests.save(guest);
    return { ok: true, status: guest.rsvpStatus };
  }

  // Confirmación de asistencia con control de lugares.
  async respond(token: string, dto: RsvpDto): Promise<Guest> {
    const guest = await this.getByToken(token);

    if (dto.status === 'declined') {
      guest.rsvpStatus = RsvpStatus.Declined;
      guest.confirmedSeats = 0;
    } else if (guest.rsvpMode === GuestRsvpMode.Cerrado) {
      // Modo cerrado: confirma exactamente los lugares autorizados (no elige cantidad).
      guest.rsvpStatus = RsvpStatus.Confirmed;
      guest.confirmedSeats = guest.allowedSeats;
    } else {
      // Modo abierto: el invitado elige cuántos, hasta su cupo.
      const seats = dto.seats ?? 1;
      if (seats < 1) {
        throw new BadRequestException('Debes confirmar al menos un lugar');
      }
      // Regla clave: no se pueden confirmar más lugares de los autorizados.
      if (seats > guest.allowedSeats) {
        throw new BadRequestException(
          `Solo tienes ${guest.allowedSeats} lugar(es) autorizado(s)`,
        );
      }
      guest.rsvpStatus = RsvpStatus.Confirmed;
      guest.confirmedSeats = seats;
    }

    if (dto.dietaryNotes !== undefined) {
      guest.dietaryNotes = dto.dietaryNotes;
    }
    guest.respondedAt = new Date();
    return this.guests.save(guest);
  }

  // ---- CSV ----

  async exportCsv(invitationId: string): Promise<string> {
    const guests = await this.listGuests(invitationId);
    const header = 'nombre,contacto,lugares_autorizados,estado,lugares_confirmados';
    const rows = guests.map((g) =>
      [
        this.csvCell(g.name),
        this.csvCell(g.contact ?? ''),
        g.allowedSeats,
        g.rsvpStatus,
        g.confirmedSeats,
      ].join(','),
    );
    return [header, ...rows].join('\n');
  }

  // Importa invitados desde CSV (nombre, contacto?, lugares_autorizados).
  async importCsv(invitationId: string, csv: string): Promise<{ imported: number }> {
    const lines = csv
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Omite la cabecera si la primera línea parece encabezado.
    const start = lines[0]?.toLowerCase().includes('nombre') ? 1 : 0;
    let imported = 0;

    for (let i = start; i < lines.length; i++) {
      const cols = this.parseCsvLine(lines[i]);
      const name = cols[0]?.trim();
      if (!name) continue;
      const contact = cols[1]?.trim() || null;
      const seats = Number.parseInt(cols[2] ?? '1', 10);
      const allowedSeats = Number.isFinite(seats) && seats > 0 ? seats : 1;

      await this.guests.save(
        this.guests.create({
          invitationId,
          name,
          contact,
          allowedSeats,
          accessToken: randomBytes(18).toString('hex'),
        }),
      );
      imported += 1;
    }
    return { imported };
  }

  private csvCell(value: string): string {
    // Escapa comillas y envuelve si hay comas o saltos.
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }
}
