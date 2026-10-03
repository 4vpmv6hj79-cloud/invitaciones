import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DesignService } from './design.service';
import { DesignRequest, DesignStatus } from './design-request.entity';
import { DesignMessage } from './design-message.entity';
import { DesignReference } from './design-reference.entity';

describe('DesignService', () => {
  let service: DesignService;

  const requests = { create: jest.fn((x) => x), save: jest.fn((x) => Promise.resolve(x)), find: jest.fn(), findOne: jest.fn() };
  const messages = { create: jest.fn((x) => x), save: jest.fn((x) => Promise.resolve(x)), find: jest.fn() };
  const references = { create: jest.fn((x) => x), save: jest.fn((x) => Promise.resolve(x)), find: jest.fn(), findOne: jest.fn(), count: jest.fn(), remove: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesignService,
        { provide: getRepositoryToken(DesignRequest), useValue: requests },
        { provide: getRepositoryToken(DesignMessage), useValue: messages },
        { provide: getRepositoryToken(DesignReference), useValue: references },
      ],
    }).compile();
    service = module.get<DesignService>(DesignService);
  });

  it('cuenta una revisión cuando el cliente pide cambios', async () => {
    requests.findOne.mockResolvedValueOnce({
      id: 'r1',
      requesterId: 'u1',
      status: DesignStatus.Propuesta,
      revisionsUsed: 0,
      revisionLimit: 2,
    });
    await service.addClientMessage('r1', 'u1', { body: 'Cambia el color', requestChanges: true });
    // Guardó la solicitud con la revisión incrementada y estado en_proceso.
    expect(requests.save).toHaveBeenCalledWith(
      expect.objectContaining({ revisionsUsed: 1, status: DesignStatus.EnProceso }),
    );
  });

  it('rechaza pedir cambios por encima del límite', async () => {
    requests.findOne.mockResolvedValueOnce({
      id: 'r1',
      requesterId: 'u1',
      status: DesignStatus.Propuesta,
      revisionsUsed: 2,
      revisionLimit: 2,
    });
    await expect(
      service.addClientMessage('r1', 'u1', { body: 'Otro cambio', requestChanges: true }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('un cliente no puede ver la solicitud de otro', async () => {
    requests.findOne.mockResolvedValueOnce({ id: 'r1', requesterId: 'otro' });
    await expect(
      service.getThread('r1', { id: 'u1', role: 'organizer' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('el admin sí puede ver cualquier solicitud', async () => {
    requests.findOne.mockResolvedValueOnce({ id: 'r1', requesterId: 'otro' });
    messages.find.mockResolvedValueOnce([]);
    const r = await service.getThread('r1', { id: 'admin1', role: 'admin' });
    expect(r.request.id).toBe('r1');
  });

  it('getPayable rechaza si no hay propuesta con precio', async () => {
    requests.findOne.mockResolvedValueOnce({
      id: 'r1',
      requesterId: 'u1',
      status: DesignStatus.EnProceso,
      priceCents: null,
    });
    await expect(service.getPayable('r1', 'u1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('addProposal con precio pone estado propuesta y fija priceCents', async () => {
    requests.findOne.mockResolvedValueOnce({ id: 'r1', status: DesignStatus.EnProceso });
    const msg = await service.addProposal('r1', 'admin1', { body: 'Mira esta propuesta' }, 250000);
    expect(msg.isProposal).toBe(true);
    expect(requests.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: DesignStatus.Propuesta, priceCents: 250000 }),
    );
  });

  it('addProposal rechaza precio inválido', async () => {
    requests.findOne.mockResolvedValueOnce({ id: 'r1', status: DesignStatus.EnProceso });
    await expect(
      service.addProposal('r1', 'admin1', { body: 'x' }, 0),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('markApprovedPaid marca aprobada y pagada', async () => {
    requests.findOne.mockResolvedValueOnce({ id: 'r1', status: DesignStatus.Propuesta, paid: false });
    const r = await service.markApprovedPaid('r1');
    expect(r.status).toBe(DesignStatus.Aprobada);
    expect(r.paid).toBe(true);
  });

  it('requestAdjustment solo tras aprobada y pagada', async () => {
    requests.findOne.mockResolvedValueOnce({
      id: 'r1',
      requesterId: 'u1',
      status: DesignStatus.Propuesta,
      paid: false,
    });
    await expect(
      service.requestAdjustment('r1', 'u1', 'cambio'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rechaza subir más del máximo de imágenes de referencia', async () => {
    requests.findOne.mockResolvedValueOnce({ id: 'r1', requesterId: 'u1' });
    references.count.mockResolvedValueOnce(6); // ya en el tope
    await expect(
      service.addReference('r1', { id: 'u1', role: 'organizer' }, 'x.jpg'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('agrega una referencia con url pública', async () => {
    requests.findOne.mockResolvedValueOnce({ id: 'r1', requesterId: 'u1' });
    references.count.mockResolvedValueOnce(0);
    const ref = await service.addReference('r1', { id: 'u1', role: 'organizer' }, 'abc.png');
    expect(ref.url).toBe('/uploads/abc.png');
  });
});
