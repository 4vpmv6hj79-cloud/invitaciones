import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Guest, RsvpStatus } from '../guests/guest.entity';
import { Invitation } from '../invitations/invitation.entity';
import { AccessAssignment } from './access-assignment.entity';
import { User, UserRole } from '../auth/user.entity';

describe('TicketsService', () => {
  let service: TicketsService;

  const guests = { findOne: jest.fn(), find: jest.fn(), save: jest.fn((x) => Promise.resolve(x)) };
  const invitations = { findOne: jest.fn(), save: jest.fn((x) => Promise.resolve(x)) };
  const assignments = { findOne: jest.fn(), create: jest.fn((x) => x), save: jest.fn((x) => Promise.resolve(x)) };
  const users = { findOne: jest.fn(), save: jest.fn((x) => Promise.resolve(x)) };
  const config = { get: jest.fn(() => 'http://localhost:4300') };

  const owner = { id: 'owner-1', role: UserRole.Organizer };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getRepositoryToken(Guest), useValue: guests },
        { provide: getRepositoryToken(Invitation), useValue: invitations },
        { provide: getRepositoryToken(AccessAssignment), useValue: assignments },
        { provide: getRepositoryToken(User), useValue: users },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();
    service = module.get<TicketsService>(TicketsService);
  });

  it('activar boletos emite token a confirmados sin token', async () => {
    invitations.findOne.mockResolvedValueOnce({ id: 'inv-1', ownerId: 'owner-1' });
    guests.find.mockResolvedValueOnce([
      { id: 'g1', rsvpStatus: RsvpStatus.Confirmed, ticketToken: null },
      { id: 'g2', rsvpStatus: RsvpStatus.Confirmed, ticketToken: 'ya-tiene' },
    ]);
    const r = await service.setTicketsEnabled('inv-1', 'owner-1', true);
    expect(r.ticketsEnabled).toBe(true);
    expect(r.issued).toBe(1); // solo g1
  });

  it('check-in marca entrada la primera vez y es idempotente la segunda', async () => {
    const guest: any = {
      id: 'g1',
      invitationId: 'inv-1',
      rsvpStatus: RsvpStatus.Confirmed,
      checkedInAt: null,
      confirmedSeats: 2,
      name: 'Ana',
    };
    invitations.findOne.mockResolvedValue({ id: 'inv-1', ownerId: 'owner-1' });
    guests.findOne.mockResolvedValueOnce(guest);
    const first = await service.checkIn('tok', owner);
    expect(first.state).toBe('valid');
    expect(guest.checkedInAt).not.toBeNull();

    // Segunda vez: ya tiene checkedInAt.
    guests.findOne.mockResolvedValueOnce(guest);
    const second = await service.checkIn('tok', owner);
    expect(second.state).toBe('already_used');
  });

  it('rechaza check-in de invitado no confirmado', async () => {
    invitations.findOne.mockResolvedValue({ id: 'inv-1', ownerId: 'owner-1' });
    guests.findOne.mockResolvedValueOnce({
      id: 'g1',
      invitationId: 'inv-1',
      rsvpStatus: RsvpStatus.Pending,
    });
    await expect(service.checkIn('tok', owner)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('un usuario no dueño y no asignado no puede validar (403)', async () => {
    invitations.findOne.mockResolvedValue({ id: 'inv-1', ownerId: 'owner-1' });
    assignments.findOne.mockResolvedValueOnce(null);
    guests.findOne.mockResolvedValueOnce({ id: 'g1', invitationId: 'inv-1' });
    await expect(
      service.inspect('tok', { id: 'intruso', role: UserRole.Staff }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
