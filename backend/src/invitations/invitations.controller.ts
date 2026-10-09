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
import { diskStorage, memoryStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname, join } from 'path';
import { writeFile } from 'fs/promises';
import { InvitationsService } from './invitations.service';
import { PdfService } from './pdf.service';
import { CloudinaryService } from './cloudinary.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { CurrentUser } from '../auth/decorators';

// Config de Multer: la imagen se mantiene en memoria (buffer) para poder subirla
// a Cloudinary. Si Cloudinary no está configurado, el controlador la escribe en
// disco local como respaldo (desarrollo). Solo imágenes; 5 MB máx.
const imageUpload = {
  storage: memoryStorage(),
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
    private readonly cloudinary: CloudinaryService,
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

    // Si Cloudinary está configurado, se sube ahí (almacenamiento permanente).
    if (this.cloudinary.isConfigured()) {
      try {
        const url = await this.cloudinary.uploadImage(file.buffer);
        return { url };
      } catch (e) {
        const detail = (e as { message?: string })?.message ?? 'error desconocido';
        throw new BadRequestException(`No se pudo subir la imagen a Cloudinary: ${detail}`);
      }
    }

    // Respaldo para desarrollo: se guarda el archivo en disco local (./uploads).
    // Nota: en Render este disco es efímero y se pierde al reiniciar.
    const name = randomBytes(16).toString('hex') + extname(file.originalname).toLowerCase();
    await writeFile(join(process.cwd(), 'uploads', name), file.buffer);
    return { url: `/uploads/${name}` };
  }
}
