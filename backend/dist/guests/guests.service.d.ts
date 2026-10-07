import { Repository } from 'typeorm';
import { Guest } from './guest.entity';
import { GuestGroup } from './guest-group.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { RsvpDto } from './dto/rsvp.dto';
import { InvitationsService } from '../invitations/invitations.service';
export declare class GuestsService {
    private readonly guests;
    private readonly groups;
    private readonly invitations;
    constructor(guests: Repository<Guest>, groups: Repository<GuestGroup>, invitations: InvitationsService);
    assertOwner(invitationId: string, ownerId: string): Promise<void>;
    createGuest(invitationId: string, dto: CreateGuestDto): Promise<Guest>;
    createGroup(invitationId: string, dto: CreateGroupDto): Promise<GuestGroup>;
    listGuests(invitationId: string): Promise<Guest[]>;
    summary(invitationId: string): Promise<{
        total: number;
        confirmed: number;
        declined: number;
        pending: number;
        seatsConfirmed: number;
        seatsAllowed: number;
    }>;
    removeGuest(invitationId: string, guestId: string): Promise<void>;
    getByToken(token: string): Promise<Guest>;
    publicRsvp(publicToken: string, data: {
        name: string;
        seats?: number;
        dietaryNotes?: string;
        status?: 'confirmed' | 'declined';
    }): Promise<{
        ok: true;
        status: string;
    }>;
    respond(token: string, dto: RsvpDto): Promise<Guest>;
    exportCsv(invitationId: string): Promise<string>;
    importCsv(invitationId: string, csv: string): Promise<{
        imported: number;
    }>;
    private csvCell;
    private parseCsvLine;
}
