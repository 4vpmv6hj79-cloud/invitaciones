import { Repository } from 'typeorm';
import { Invitation } from './invitation.entity';
import { Event } from './event.entity';
import { TemplateDefinition } from '../templates/template.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
export declare class InvitationsService {
    private readonly invitations;
    private readonly events;
    private readonly templates;
    constructor(invitations: Repository<Invitation>, events: Repository<Event>, templates: Repository<TemplateDefinition>);
    createDraft(dto: CreateInvitationDto, ownerId: string): Promise<Invitation>;
    findOne(id: string): Promise<Invitation>;
    findOwned(id: string, ownerId: string): Promise<Invitation>;
    listByOwner(ownerId: string): Promise<Invitation[]>;
    update(id: string, dto: UpdateInvitationDto, ownerId: string): Promise<Invitation>;
    publish(id: string, validityDays: number): Promise<Invitation>;
    getPublishedByToken(token: string): Promise<Invitation>;
    buildShareSvg(token: string): Promise<string>;
    buildSharePng(token: string): Promise<Buffer>;
    private escapeXml;
    findPublicByToken(token: string): Promise<{
        title: string;
        eventType: string;
        data: Record<string, unknown>;
        customization: Record<string, unknown>;
        expired: boolean;
    }>;
}
