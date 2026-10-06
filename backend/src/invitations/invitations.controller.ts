import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { InvitationsService } from './invitations.service';
import { PdfService } from './pdf.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { CurrentUser } from '../auth/decorators';

// Config de Multer: guarda en uploads/ con nombre aleatorio; solo imágenes; 5 MB máx.
const imageUpload = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const name = randomBytes(16).toString('hex') + extname(file.originalname).toLowerCase();
      cb(null, name);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: unknown, file: Express.Multer.File, cb: (e: Error | null, ok: boolean) => void) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Solo se permiten imágenes (jpg, png, webp, gif)'), false);
    }
  },
};

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

  // Sube una imagen (portada o galería) y devuelve su URL pública.
  // multipart form-data, campo 'file'. Solo el dueño de la invitación.
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file', imageUpload))
  async uploadImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string },
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ninguna imagen');
    }
    // Verifica que el usuario sea dueño de la invitación antes de aceptar la imagen.
    await this.service.findOwned(id, user.id);
    return { url: `/uploads/${file.filename}` };
  }
}
