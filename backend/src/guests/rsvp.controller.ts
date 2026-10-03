import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { InvitationsService } from '../invitations/invitations.service';
import { RsvpDto } from './dto/rsvp.dto';
import { Public } from '../auth/decorators';

// Acceso del invitado por token opaco (sin cuenta).
// No expone la lista de invitados ni datos de otros.
@Public()
@Controller('rsvp')
export class RsvpController {
  constructor(
    private readonly guests: GuestsService,
    private readonly invitations: InvitationsService,
  ) {}

  // GET /rsvp/:token -> datos del invitado + invitación pública para mostrar y confirmar.
  @Get(':token')
  async view(@Param('token') token: string) {
    const guest = await this.guests.getByToken(token);
    // Carga la invitación asociada para mostrar el diseño/contenido.
    const invitation = await this.invitations.findOne(guest.invitationId);
    return {
      guest: {
        name: guest.name,
        allowedSeats: guest.allowedSeats,
        rsvpStatus: guest.rsvpStatus,
        confirmedSeats: guest.confirmedSeats,
        dietaryNotes: guest.dietaryNotes ?? null,
      },
      invitation: {
        title: invitation.event.title,
        eventType: invitation.event.type,
        data: invitation.event.data,
        customization: invitation.customization,
        status: invitation.status,
      },
    };
  }

  // POST /rsvp/:token -> confirmar o declinar, con control de lugares.
  @Post(':token')
  async respond(@Param('token') token: string, @Body() dto: RsvpDto) {
    const guest = await this.guests.respond(token, dto);
    return {
      rsvpStatus: guest.rsvpStatus,
      confirmedSeats: guest.confirmedSeats,
    };
  }
}
