import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CurrentUser, Public } from '../auth/decorators';
import { UserRole } from '../auth/user.entity';

type AuthUser = { id: string; role: UserRole };

@Controller()
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  // --- Organizador (dueño) ---

  // Activa/desactiva boletos de la invitación. PATCH /invitations/:id/tickets
  @Patch('invitations/:id/tickets')
  setEnabled(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('enabled') enabled: boolean,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.setTicketsEnabled(id, user.id, !!enabled);
  }

  // Asigna personal de acceso por correo. POST /invitations/:id/staff
  @Post('invitations/:id/staff')
  assignStaff(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('email') email: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.assignStaff(id, user.id, email ?? '');
  }

  // --- Invitado (público, por su accessToken) ---

  // Pase con QR del invitado. GET /pass/:accessToken
  @Public()
  @Get('pass/:accessToken')
  getPass(@Param('accessToken') accessToken: string) {
    return this.service.getGuestPass(accessToken);
  }

  // --- Personal de acceso / dueño ---

  // Consulta el estado del pase. GET /tickets/:ticketToken
  @Get('tickets/:ticketToken')
  inspect(@Param('ticketToken') ticketToken: string, @CurrentUser() user: AuthUser) {
    return this.service.inspect(ticketToken, user);
  }

  // Registra la entrada. POST /tickets/:ticketToken/checkin
  @Post('tickets/:ticketToken/checkin')
  checkIn(@Param('ticketToken') ticketToken: string, @CurrentUser() user: AuthUser) {
    return this.service.checkIn(ticketToken, user);
  }
}
