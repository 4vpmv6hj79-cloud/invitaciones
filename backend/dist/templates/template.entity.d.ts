import { EventType, TemplateFormat, TemplateStyle } from './template.enums';
export declare class TemplateDefinition {
    id: string;
    name: string;
    description: string;
    eventTypes: EventType[];
    format: TemplateFormat;
    style: TemplateStyle;
    previewUrl: string;
    schema: Record<string, unknown>;
    theme: Record<string, unknown>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
