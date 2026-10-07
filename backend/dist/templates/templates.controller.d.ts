import { TemplatesService } from './templates.service';
import { QueryTemplatesDto } from './dto/query-templates.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
export declare class TemplatesController {
    private readonly service;
    constructor(service: TemplatesService);
    findCatalog(query: QueryTemplatesDto): Promise<import("./template.entity").TemplateDefinition[]>;
    getFilters(): {
        eventTypes: {
            value: string;
            label: string;
        }[];
        formats: {
            value: string;
            label: string;
        }[];
        styles: {
            value: string;
            label: string;
        }[];
    };
    findAllForAdmin(): Promise<import("./template.entity").TemplateDefinition[]>;
    create(dto: CreateTemplateDto): Promise<import("./template.entity").TemplateDefinition>;
    setActive(id: string, isActive: boolean): Promise<import("./template.entity").TemplateDefinition>;
    findOne(id: string): Promise<import("./template.entity").TemplateDefinition>;
}
