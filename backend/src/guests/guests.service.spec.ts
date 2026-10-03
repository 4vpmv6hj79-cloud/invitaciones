import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { Guest, RsvpStatus } from './guest.entity';
import { GuestGroup } from './guest-group.entity';
import { InvitationsService } from '../invitations/invitations.service';

describe('GuestsService', () => {
  let service: GuestsService;

  const guestsRepo = {
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve(x)),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
  const groupsRepo = {
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve(x)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestsService,
        { provide: getRepositoryToken(Guest), useValue: guestsRepo },
        { provide: getRepositoryToken(GuestGroup), useValue: groupsRepo },
        { provide: InvitationsService, useValue: { findOwned: jest.fn() } },
      ],
    }).compile();

    service = module.get<GuestsService>(GuestsService);
  });

  it('crea invitado con token de acceso generado', async () => {
    const guest = await service.createGuest('inv-1', { name: 'Ana', allowedSeats: 2 });
    expect(guest.invitationId).toBe('inv-1');
    expect(guest.accessToken).toBeDefined();
    expect(guest.accessToken.length).toBeGreaterThan(10);
  });

  it('confirma asistencia dentro de los lugares autorizados', async () => {
    guestsRepo.findOne.mockResolvedValueOnce({
      id: 'g1',
      allowedSeats: 3,
      rsvpStatus: RsvpStatus.Pending,
      confirmedSeats: 0,
    });
    const result = await service.respond('tok', { status: 'confirmed', seats: 2 });
    expect(result.rsvpStatus).toBe(RsvpStatus.Confirmed);
    expect(result.confirmedSeats).toBe(2);
  });

  it('RECHAZA confirmar más lugares de los autorizados', async () => {
    guestsRepo.findOne.mockResolvedValueOnce({
      id: 'g1',
      allowedSeats: 2,
      rsvpStatus: RsvpStatus.Pending,
      confirmedSeats: 0,
    });
    await expect(
      service.respond('tok', { status: 'confirmed', seats: 5 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('declinar deja 0 lugares confirmados', async () => {
    guestsRepo.findOne.mockResolvedValueOnce({
      id: 'g1',
      allowedSeats: 2,
      rsvpStatus: RsvpStatus.Pending,
      confirmedSeats: 2,
    });
    const result = await service.respond('tok', { status: 'declined' });
    expect(result.rsvpStatus).toBe(RsvpStatus.Declined);
    expect(result.confirmedSeats).toBe(0);
  });

  it('resumen cuenta estados y suma lugares', async () => {
    guestsRepo.find.mockResolvedValueOnce([
      { rsvpStatus: RsvpStatus.Confirmed, allowedSeats: 2, confirmedSeats: 2 },
      { rsvpStatus: RsvpStatus.Pending, allowedSeats: 1, confirmedSeats: 0 },
      { rsvpStatus: RsvpStatus.Declined, allowedSeats: 3, confirmedSeats: 0 },
    ]);
    const s = await service.summary('inv-1');
    expect(s.total).toBe(3);
    expect(s.confirmed).toBe(1);
    expect(s.pending).toBe(1);
    expect(s.declined).toBe(1);
    expect(s.seatsConfirmed).toBe(2);
    expect(s.seatsAllowed).toBe(6);
  });

  it('importa invitados desde CSV omitiendo la cabecera', async () => {
    const csv = 'nombre,contacto,lugares_autorizados\nAna,ana@mail.com,2\nLuis,,4';
    const result = await service.importCsv('inv-1', csv);
    expect(result.imported).toBe(2);
  });
});
