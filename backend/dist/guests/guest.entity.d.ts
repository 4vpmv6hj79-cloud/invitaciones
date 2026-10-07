import { Invitation } from '../invitations/invitation.entity';
import { GuestGroup } from './guest-group.entity';
export declare enum RsvpStatus {
    Pending = "pending",
    Confirmed = "confirmed",
    Declined = "declined"
}
export declare enum GuestRsvpMode {
    Abierto = "abierto",
    Cerrado = "cerrado"
}
export declare class Guest {
    id: string;
    invitation: Invitation;
    invitationId: string;
    group?: GuestGroup | null;
    groupId?: string | null;
    name: string;
    contact?: string | null;
    allowedSeats: number;
    rsvpMode: GuestRsvpMode;
    rsvpStatus: RsvpStatus;
    confirmedSeats: number;
    dietaryNotes?: string | null;
    accessToken: string;
    ticketToken?: string | null;
    checkedInAt?: Date | null;
    respondedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
