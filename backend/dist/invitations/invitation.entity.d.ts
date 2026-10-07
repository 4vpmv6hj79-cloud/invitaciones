import { TemplateDefinition } from '../templates/template.entity';
import { Event } from './event.entity';
export declare enum InvitationStatus {
    Draft = "draft",
    Published = "published"
}
export declare class Invitation {
    id: string;
    template: TemplateDefinition;
    templateId: string;
    ownerId: string | null;
    ticketsEnabled: boolean;
    event: Event;
    eventId: string;
    customization: Record<string, unknown>;
    status: InvitationStatus;
    publicToken: string | null;
    publishedAt: Date | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
