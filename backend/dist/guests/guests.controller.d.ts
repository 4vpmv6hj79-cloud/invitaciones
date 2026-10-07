import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { CreateGroupDto } from './dto/create-group.dto';
export declare class GuestsController {
    private readonly service;
    constructor(service: GuestsService);
    createGuest(invitationId: string, dto: CreateGuestDto, user: {
        id: string;
    }): Promise<import("./guest.entity").Guest>;
    createGroup(invitationId: string, dto: CreateGroupDto, user: {
        id: string;
    }): Promise<import("./guest-group.entity").GuestGroup>;
    list(invitationId: string, user: {
        id: string;
    }): Promise<import("./guest.entity").Guest[]>;
    summary(invitationId: string, user: {
        id: string;
    }): Promise<{
        total: number;
        confirmed: number;
        declined: number;
        pending: number;
        seatsConfirmed: number;
        seatsAllowed: number;
    }>;
    export(invitationId: string, user: {
        id: string;
    }): Promise<string>;
    import(invitationId: string, csv: string, user: {
        id: string;
    }): Promise<{
        imported: number;
    }>;
    remove(invitationId: string, guestId: string, user: {
        id: string;
    }): Promise<void>;
}
