import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { DesignService } from './design.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { PostMessageDto } from './dto/post-message.dto';
import { CurrentUser } from '../auth/decorators';
import { UserRole } from '../auth/user.entity';

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

type AuthUser = { id: string; role: UserRole };

// Solicitudes de diseño del cliente (requiere sesión; guard global).
@Controller('design-requests')
export class DesignController {
  constructor(private readonly service: DesignService) {}

  @Post()
  create(@Body() dto: CreateRequestDto, @CurrentUser() user: AuthUser) {
    return this.service.createRequest(user.id, dto);
  }

  @Get()
  listMine(@CurrentUser() user: AuthUser) {
    return this.service.listMine(user.id);
  }

  @Get(':id')
  getThread(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthUser) {
    return this.service.getThread(id, user);
  }

  @Post(':id/messages')
  addMessage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: PostMessageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.addClientMessage(id, user.id, dto);
  }

  // El cliente solicita un ajuste tras aprobar y pagar (tendrá costo adicional).
  @Post(':id/request-adjustment')
  requestAdjustment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('note') note: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.requestAdjustment(id, user.id, note ?? '');
  }

  // --- Imágenes de referencia ---

  @Get(':id/references')
  listReferences(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthUser) {
    return this.service.listReferences(id, user);
  }

  // Sube una imagen (multipart form-data, campo 'file').
  @Post(':id/references')
  @UseInterceptors(FileInterceptor('file', imageUpload))
  uploadReference(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ninguna imagen');
    }
    return this.service.addReference(id, user, file.filename);
  }

  @Delete(':id/references/:refId')
  removeReference(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('refId', new ParseUUIDPipe()) refId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.removeReference(id, refId, user);
  }
}
