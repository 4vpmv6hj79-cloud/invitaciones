import { EventType } from '../templates/template.enums';
import { Invitation } from './invitation.entity';
export declare class Event {
    id: string;
    type: EventType;
    title: string;
    data: Record<string, unknown>;
    invitation?: Invitation;
    createdAt: Date;
    updatedAt: Date;
}
