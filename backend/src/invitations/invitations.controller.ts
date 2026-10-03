import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { InvitationsService } from './invitations.service';
import { PdfService } from './pdf.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { CurrentUser } from '../auth/decorators';

// Todas estas rutas requieren un organizador autenticado (guard global).
@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly service: InvitationsService,
    private readonly pdf: PdfService,
  ) {}

  // Crea un borrador desde una plantilla, propiedad del usuario actual.
  @Post()
  create(@Body() dto: CreateInvitationDto, @CurrentUser() user: { id: string }) {
    return this.service.createDraft(dto, user.id);
  }

  // Lista las invitaciones del usuario actual.
  @Get()
  listMine(@CurrentUser() user: { id: string }) {
    return this.service.listByOwner(user.id);
  }

  // Lee el borrador (solo el dueño). GET /invitations/:id
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.findOwned(id, user.id);
  }

  // Descarga el PDF imprimible (solo el dueño). GET /invitations/:id/pdf?size=A5|A6|LETTER
  @Get(':id/pdf')
  async downloadPdf(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: { id: string },
    @Res() res: Response,
    @Query('size') size?: string,
  ) {
    const invitation = await this.service.findOwned(id, user.id);
    const resolved = this.pdf.resolveSize(size);
    const buffer = await this.pdf.buildInvitationPdf(invitation, resolved);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invitacion-${resolved}.pdf"`,
    });
    res.send(buffer);
  }

  // Guarda el borrador (solo el dueño). PATCH /invitations/:id
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateInvitationDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.update(id, dto, user.id);
  }
}
