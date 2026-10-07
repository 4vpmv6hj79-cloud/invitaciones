import { GuestsService } from './guests.service';
import { InvitationsService } from '../invitations/invitations.service';
import { RsvpDto } from './dto/rsvp.dto';
export declare class RsvpController {
    private readonly guests;
    private readonly invitations;
    constructor(guests: GuestsService, invitations: InvitationsService);
    view(token: string): Promise<{
        guest: {
            name: string;
            allowedSeats: number;
            rsvpStatus: import("./guest.entity").RsvpStatus;
            confirmedSeats: number;
            dietaryNotes: string | null;
        };
        invitation: {
            title: string;
            eventType: import("../templates/template.enums").EventType;
            data: Record<string, unknown>;
            customization: Record<string, unknown>;
            status: import("../invitations/invitation.entity").InvitationStatus;
        };
    }>;
    respond(token: string, dto: RsvpDto): Promise<{
        rsvpStatus: import("./guest.entity").RsvpStatus;
        confirmedSeats: number;
    }>;
}
