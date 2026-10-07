import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Guest } from '../guests/guest.entity';
import { Invitation } from '../invitations/invitation.entity';
import { AccessAssignment } from './access-assignment.entity';
import { User, UserRole } from '../auth/user.entity';
export interface ValidationResult {
    state: 'valid' | 'already_used' | 'not_confirmed';
    guestName: string;
    confirmedSeats: number;
    checkedInAt: string | null;
}
export declare class TicketsService {
    private readonly guests;
    private readonly invitations;
    private readonly assignments;
    private readonly users;
    private readonly config;
    constructor(guests: Repository<Guest>, invitations: Repository<Invitation>, assignments: Repository<AccessAssignment>, users: Repository<User>, config: ConfigService);
    private assertOwner;
    private assertCanValidate;
    setTicketsEnabled(invitationId: string, userId: string, enabled: boolean): Promise<{
        ticketsEnabled: boolean;
        issued: number;
    }>;
    getGuestPass(accessToken: string): Promise<{
        hasPass: boolean;
        guestName?: string;
        seats?: number;
        qrDataUrl?: string;
        reason?: string;
    }>;
    inspect(ticketToken: string, user: {
        id: string;
        role: UserRole;
    }): Promise<ValidationResult>;
    checkIn(ticketToken: string, user: {
        id: string;
        role: UserRole;
    }): Promise<ValidationResult>;
    assignStaff(invitationId: string, ownerId: string, email: string): Promise<AccessAssignment>;
    private toResult;
}
