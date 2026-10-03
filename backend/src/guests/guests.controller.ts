import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CurrentUser } from '../auth/decorators';

// Gestión de invitados por el organizador DUEÑO de la invitación (guard global + propiedad).
@Controller('invitations/:invitationId/guests')
export class GuestsController {
  constructor(private readonly service: GuestsService) {}

  @Post()
  async createGuest(
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
    @Body() dto: CreateGuestDto,
    @CurrentUser() user: { id: string },
  ) {
    await this.service.assertOwner(invitationId, user.id);
    return this.service.createGuest(invitationId, dto);
  }

  @Post('groups')
  async createGroup(
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
    @Body() dto: CreateGroupDto,
    @CurrentUser() user: { id: string },
  ) {
    await this.service.assertOwner(invitationId, user.id);
    return this.service.createGroup(invitationId, dto);
  }

  @Get()
  async list(
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
    @CurrentUser() user: { id: string },
  ) {
    await this.service.assertOwner(invitationId, user.id);
    return this.service.listGuests(invitationId);
  }

  @Get('summary')
  async summary(
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
    @CurrentUser() user: { id: string },
  ) {
    await this.service.assertOwner(invitationId, user.id);
    return this.service.summary(invitationId);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="invitados.csv"')
  async export(
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
    @CurrentUser() user: { id: string },
  ) {
    await this.service.assertOwner(invitationId, user.id);
    return this.service.exportCsv(invitationId);
  }

  @Post('import')
  async import(
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
    @Body('csv') csv: string,
    @CurrentUser() user: { id: string },
  ) {
    await this.service.assertOwner(invitationId, user.id);
    return this.service.importCsv(invitationId, csv ?? '');
  }

  @Delete(':guestId')
  async remove(
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
    @Param('guestId', new ParseUUIDPipe()) guestId: string,
    @CurrentUser() user: { id: string },
  ) {
    await this.service.assertOwner(invitationId, user.id);
    return this.service.removeGuest(invitationId, guestId);
  }
}
