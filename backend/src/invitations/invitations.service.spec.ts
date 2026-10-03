import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { Invitation } from './invitation.entity';
import { Event } from './event.entity';
import { TemplateDefinition } from '../templates/template.entity';
import { EventType } from '../templates/template.enums';

describe('InvitationsService', () => {
  let service: InvitationsService;

  const invitationsRepo = {
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve({ id: 'inv-1', ...x })),
    findOne: jest.fn(),
  };
  const eventsRepo = {
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve(x)),
  };
  const templatesRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        { provide: getRepositoryToken(Invitation), useValue: invitationsRepo },
        { provide: getRepositoryToken(Event), useValue: eventsRepo },
        { provide: getRepositoryToken(TemplateDefinition), useValue: templatesRepo },
      ],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
  });

  it('crea un borrador copiando el theme de la plantilla', async () => {
    templatesRepo.findOne.mockResolvedValueOnce({
      id: 'tpl-1',
      eventTypes: [EventType.BodaDeOro],
      theme: { primary: '#b8860b', bodyFont: 'Lato' },
    });

    const result = await service.createDraft({ templateId: 'tpl-1' }, 'owner-1');

    expect(result.templateId).toBe('tpl-1');
    expect(result.ownerId).toBe('owner-1');
    expect(result.customization).toEqual({ primary: '#b8860b', bodyFont: 'Lato' });
    expect(eventsRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: EventType.BodaDeOro }),
    );
  });

  it('lanza 404 si la plantilla no existe al crear', async () => {
    templatesRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.createDraft({ templateId: 'x' }, 'owner-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('actualiza mezclando contenido y personalización sin perder lo previo', async () => {
    invitationsRepo.findOne.mockResolvedValueOnce({
      id: 'inv-1',
      ownerId: 'owner-1',
      event: { id: 'ev-1', title: 'viejo', data: { time: '18:00' } },
      customization: { primary: '#000', bodyFont: 'Lato' },
    });

    const result = await service.update(
      'inv-1',
      {
        title: 'Nuestro aniversario',
        eventData: { coupleOrHonoree: 'Ana y Luis' },
        customization: { primary: '#b8860b' },
      },
      'owner-1',
    );

    expect(result.event.title).toBe('Nuestro aniversario');
    // Conserva time previo y agrega el nuevo nombre.
    expect(result.event.data).toEqual({ time: '18:00', coupleOrHonoree: 'Ana y Luis' });
    // Conserva bodyFont y sobrescribe primary.
    expect(result.customization).toEqual({ primary: '#b8860b', bodyFont: 'Lato' });
  });

  it('lanza 404 al actualizar una invitación inexistente', async () => {
    invitationsRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.update('x', {}, 'owner-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findOwned rechaza a quien no es el dueño (403)', async () => {
    invitationsRepo.findOne.mockResolvedValueOnce({ id: 'inv-1', ownerId: 'owner-1' });
    await expect(service.findOwned('inv-1', 'otro-usuario')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
