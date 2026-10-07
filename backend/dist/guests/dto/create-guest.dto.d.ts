export declare class CreateGuestDto {
    name: string;
    contact?: string;
    allowedSeats: number;
    rsvpMode?: 'abierto' | 'cerrado';
    groupId?: string;
}
