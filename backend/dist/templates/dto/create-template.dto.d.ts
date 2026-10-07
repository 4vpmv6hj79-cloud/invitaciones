import { EventType, TemplateFormat, TemplateStyle } from '../template.enums';
export declare class CreateTemplateDto {
    name: string;
    description?: string;
    eventTypes: EventType[];
    format: TemplateFormat;
    style: TemplateStyle;
    previewUrl?: string;
    isActive?: boolean;
}
