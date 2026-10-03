import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { DesignRequest, DesignStatus } from './design-request.entity';
import { DesignMessage } from './design-message.entity';
import { DesignReference } from './design-reference.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { PostMessageDto } from './dto/post-message.dto';

export interface RequestWithThread {
  request: DesignRequest;
  messages: DesignMessage[];
}

@Injectable()
export class DesignService {
  // Máximo de imágenes de referencia por solicitud.
  private readonly MAX_REFERENCES = 6;

  constructor(
    @InjectRepository(DesignRequest)
    private readonly requests: Repository<DesignRequest>,
    @InjectRepository(DesignMessage)
    private readonly messages: Repository<DesignMessage>,
    @InjectRepository(DesignReference)
    private readonly references: Repository<DesignReference>,
  ) {}

  // Verifica acceso a la solicitud (dueño o admin) y la devuelve.
  private async assertAccess(id: string, user: { id: string; role: string }): Promise<DesignRequest> {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    if (user.role !== 'admin' && request.requesterId !== user.id) {
      throw new ForbiddenException('No tienes acceso a esta solicitud');
    }
    return request;
  }

  // Registra una imagen de referencia ya guardada en disco por Multer.
  async addReference(
    id: string,
    user: { id: string; role: string },
    filename: string,
  ): Promise<DesignReference> {
    // Si el acceso falla, borra el archivo que Multer ya guardó (evita huérfanos).
    try {
      await this.assertAccess(id, user);
    } catch (err) {
      await this.safeUnlink(filename);
      throw err;
    }
    const count = await this.references.count({ where: { requestId: id } });
    if (count >= this.MAX_REFERENCES) {
      // Borra el archivo recién subido para no dejar huérfanos.
      await this.safeUnlink(filename);
      throw new BadRequestException(`Máximo ${this.MAX_REFERENCES} imágenes por solicitud`);
    }
    return this.references.save(
      this.references.create({
        requestId: id,
        filename,
        url: `/uploads/${filename}`,
      }),
    );
  }

  async listReferences(id: string, user: { id: string; role: string }): Promise<DesignReference[]> {
    await this.assertAccess(id, user);
    return this.references.find({ where: { requestId: id }, order: { createdAt: 'ASC' } });
  }

  async removeReference(id: string, refId: string, user: { id: string; role: string }): Promise<void> {
    await this.assertAccess(id, user);
    const ref = await this.references.findOne({ where: { id: refId, requestId: id } });
    if (!ref) {
      throw new NotFoundException('Imagen no encontrada');
    }
    await this.references.remove(ref);
    await this.safeUnlink(ref.filename);
  }

  private async safeUnlink(filename: string): Promise<void> {
    try {
      await unlink(join(process.cwd(), 'uploads', filename));
    } catch {
      // Si el archivo ya no está, no es un error que deba interrumpir la operación.
    }
  }

  // ---- Cliente ----

  async createRequest(requesterId: string, dto: CreateRequestDto): Promise<DesignRequest> {
    return this.requests.save(
      this.requests.create({
        requesterId,
        title: dto.title,
        eventType: dto.eventType,
        style: dto.style ?? '',
        details: dto.details,
        budget: dto.budget ?? null,
        status: DesignStatus.Nueva,
      }),
    );
  }

  async listMine(requesterId: string): Promise<DesignRequest[]> {
    return this.requests.find({
      where: { requesterId },
      order: { createdAt: 'DESC' },
    });
  }

  // Solicitud + hilo. Verifica propiedad salvo que sea admin.
  async getThread(id: string, user: { id: string; role: string }): Promise<RequestWithThread> {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    if (user.role !== 'admin' && request.requesterId !== user.id) {
      throw new ForbiddenException('No tienes acceso a esta solicitud');
    }
    const messages = await this.messages.find({
      where: { requestId: id },
      order: { createdAt: 'ASC' },
    });
    return { request, messages };
  }

  // Mensaje del cliente. Si pide cambios, cuenta como revisión (respeta el tope).
  async addClientMessage(id: string, userId: string, dto: PostMessageDto): Promise<DesignMessage> {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    if (request.requesterId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta solicitud');
    }
    if (request.status === DesignStatus.Aprobada || request.status === DesignStatus.Rechazada) {
      throw new BadRequestException('La solicitud ya está cerrada');
    }

    if (dto.requestChanges) {
      if (request.revisionsUsed >= request.revisionLimit) {
        throw new BadRequestException(
          `Alcanzaste el límite de ${request.revisionLimit} revisiones`,
        );
      }
      request.revisionsUsed += 1;
      // Pedir cambios reabre el trabajo del negocio.
      request.status = DesignStatus.EnProceso;
      await this.requests.save(request);
    }

    return this.messages.save(
      this.messages.create({
        requestId: id,
        authorId: userId,
        authorRole: 'client',
        body: dto.body,
        isProposal: false,
      }),
    );
  }

  // Devuelve la solicitud validando que el usuario sea el dueño y que esté lista
  // para pagar (estado propuesta con precio). La usa OrdersService.
  async getPayable(id: string, userId: string): Promise<DesignRequest> {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    if (request.requesterId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta solicitud');
    }
    if (request.status !== DesignStatus.Propuesta || !request.priceCents) {
      throw new BadRequestException('Esta solicitud no tiene una propuesta por pagar');
    }
    return request;
  }

  // Marca la solicitud como aprobada y pagada. La llama OrdersService cuando se
  // confirma el pago del diseño (webhook o modo simulado). Idempotente.
  async markApprovedPaid(id: string): Promise<DesignRequest> {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    request.status = DesignStatus.Aprobada;
    request.paid = true;
    return this.requests.save(request);
  }

  // El cliente solicita un ajuste DESPUÉS de aprobar y pagar. Tiene costo adicional:
  // reabre la solicitud a 'ajuste_solicitado' para que el admin envíe una nueva
  // propuesta con su precio. Resetea paid (el ajuste se cobra aparte).
  async requestAdjustment(id: string, userId: string, note: string): Promise<DesignMessage> {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    if (request.requesterId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta solicitud');
    }
    if (request.status !== DesignStatus.Aprobada || !request.paid) {
      throw new BadRequestException(
        'Solo puedes solicitar un ajuste con costo sobre un diseño aprobado y pagado',
      );
    }
    request.status = DesignStatus.AjusteSolicitado;
    request.paid = false;
    request.priceCents = null;
    await this.requests.save(request);

    return this.messages.save(
      this.messages.create({
        requestId: id,
        authorId: userId,
        authorRole: 'client',
        body: note || 'Solicito un ajuste adicional (con costo).',
        isProposal: false,
      }),
    );
  }

  // ---- Admin ----

  async listAll(status?: DesignStatus): Promise<DesignRequest[]> {
    return this.requests.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async setStatus(id: string, status: DesignStatus): Promise<DesignRequest> {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    request.status = status;
    return this.requests.save(request);
  }

  // El admin envía una propuesta con precio: añade mensaje marcado, fija el precio
  // y pone estado 'propuesta'. El cliente deberá pagar ese precio para aprobar.
  async addProposal(
    id: string,
    adminId: string,
    dto: PostMessageDto,
    priceCents: number,
  ): Promise<DesignMessage> {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    if (!priceCents || priceCents < 100) {
      throw new BadRequestException('La propuesta debe incluir un precio válido (mínimo $1)');
    }
    request.status = DesignStatus.Propuesta;
    request.priceCents = priceCents;
    request.paid = false;
    await this.requests.save(request);

    return this.messages.save(
      this.messages.create({
        requestId: id,
        authorId: adminId,
        authorRole: 'admin',
        body: dto.body,
        isProposal: true,
      }),
    );
  }
}
