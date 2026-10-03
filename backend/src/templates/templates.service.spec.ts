import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplateDefinition } from './template.entity';
import { EventType, TemplateFormat, TemplateStyle } from './template.enums';

describe('TemplatesService', () => {
  let service: TemplatesService;

  // QueryBuilder simulado para comprobar que los filtros se arman correctamente.
  const qb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  const repo = {
    createQueryBuilder: jest.fn(() => qb),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve({ id: 'uuid-1', ...x })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        { provide: getRepositoryToken(TemplateDefinition), useValue: repo },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('solo devuelve plantillas activas en el catálogo', async () => {
    await service.findCatalog({});
    expect(qb.where).toHaveBeenCalledWith('t.isActive = :active', { active: true });
  });

  it('aplica los tres filtros cuando se envían', async () => {
    await service.findCatalog({
      eventType: EventType.BodaDeOro,
      style: TemplateStyle.Elegante,
      format: TemplateFormat.Web,
    });
    expect(qb.andWhere).toHaveBeenCalledWith('t.style = :style', {
      style: TemplateStyle.Elegante,
    });
    expect(qb.andWhere).toHaveBeenCalledWith('t.format = :format', {
      format: TemplateFormat.Web,
    });
    expect(qb.andWhere).toHaveBeenCalledWith(':eventType = ANY(t.eventTypes)', {
      eventType: EventType.BodaDeOro,
    });
  });

  it('lanza 404 si la plantilla no existe', async () => {
    repo.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne('inexistente')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('el seed es idempotente: no inserta las que ya existen', async () => {
    // Simula que todas ya existen -> 0 insertadas.
    repo.findOne.mockResolvedValue({ id: 'x' });
    repo.count.mockResolvedValue(12);
    const result = await service.seed();
    expect(result.inserted).toBe(0);
    expect(result.total).toBe(12);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
