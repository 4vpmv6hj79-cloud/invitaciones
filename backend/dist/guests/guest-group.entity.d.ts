import { Invitation } from '../invitations/invitation.entity';
export declare class GuestGroup {
    id: string;
    invitation: Invitation;
    invitationId: string;
    name: string;
    allowedSeats: number;
    createdAt: Date;
}
