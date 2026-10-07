import { EventType, TemplateFormat, TemplateStyle } from './template.enums';
export interface SeedTemplate {
    name: string;
    description: string;
    eventTypes: EventType[];
    format: TemplateFormat;
    style: TemplateStyle;
    theme: {
        primary: string;
        secondary: string;
        background: string;
        headingFont: string;
        bodyFont: string;
    };
}
export declare const SEED_TEMPLATES: SeedTemplate[];
