import { TicketsService } from './tickets.service';
import { UserRole } from '../auth/user.entity';
type AuthUser = {
    id: string;
    role: UserRole;
};
export declare class TicketsController {
    private readonly service;
    constructor(service: TicketsService);
    setEnabled(id: string, enabled: boolean, user: AuthUser): Promise<{
        ticketsEnabled: boolean;
        issued: number;
    }>;
    assignStaff(id: string, email: string, user: AuthUser): Promise<import("./access-assignment.entity").AccessAssignment>;
    getPass(accessToken: string): Promise<{
        hasPass: boolean;
        guestName?: string;
        seats?: number;
        qrDataUrl?: string;
        reason?: string;
    }>;
    inspect(ticketToken: string, user: AuthUser): Promise<import("./tickets.service").ValidationResult>;
    checkIn(ticketToken: string, user: AuthUser): Promise<import("./tickets.service").ValidationResult>;
}
export {};
