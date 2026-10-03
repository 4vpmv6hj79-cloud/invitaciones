import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateDefinition } from './template.entity';
import { QueryTemplatesDto } from './dto/query-templates.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { SEED_TEMPLATES } from './templates.seed-data';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateDefinition)
    private readonly repo: Repository<TemplateDefinition>,
  ) {}

  // Catálogo público: solo plantillas activas, con filtros opcionales.
  async findCatalog(query: QueryTemplatesDto): Promise<TemplateDefinition[]> {
    const qb = this.repo
      .createQueryBuilder('t')
      .where('t.isActive = :active', { active: true });

    if (query.style) {
      qb.andWhere('t.style = :style', { style: query.style });
    }
    if (query.format) {
      qb.andWhere('t.format = :format', { format: query.format });
    }
    // eventTypes es un arreglo: filtra las plantillas que incluyen el evento pedido.
    if (query.eventType) {
      qb.andWhere(':eventType = ANY(t.eventTypes)', { eventType: query.eventType });
    }

    return qb.orderBy('t.createdAt', 'DESC').getMany();
  }

  // Detalle para la vista de ejemplo. Lanza 404 si no existe.
  async findOne(id: string): Promise<TemplateDefinition> {
    const template = await this.repo.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('Plantilla no encontrada');
    }
    return template;
  }

  // Listado para administración: incluye activas e inactivas.
  async findAllForAdmin(): Promise<TemplateDefinition[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateTemplateDto): Promise<TemplateDefinition> {
    const template = this.repo.create(dto);
    return this.repo.save(template);
  }

  // Activa o desactiva una plantilla (publicar/retirar sin borrar).
  async setActive(id: string, isActive: boolean): Promise<TemplateDefinition> {
    const template = await this.findOne(id);
    template.isActive = isActive;
    return this.repo.save(template);
  }

  // Siembra el catálogo inicial. Idempotente: no duplica plantillas ya existentes
  // (se identifican por nombre). Devuelve cuántas se insertaron.
  async seed(): Promise<{ inserted: number; total: number }> {
    let inserted = 0;
    for (const seed of SEED_TEMPLATES) {
      const exists = await this.repo.findOne({ where: { name: seed.name } });
      if (!exists) {
        await this.repo.save(this.repo.create(seed));
        inserted += 1;
      }
    }
    const total = await this.repo.count();
    return { inserted, total };
  }
}
