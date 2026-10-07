import { Repository } from 'typeorm';
import { TemplateDefinition } from './template.entity';
import { QueryTemplatesDto } from './dto/query-templates.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
export declare class TemplatesService {
    private readonly repo;
    constructor(repo: Repository<TemplateDefinition>);
    findCatalog(query: QueryTemplatesDto): Promise<TemplateDefinition[]>;
    findOne(id: string): Promise<TemplateDefinition>;
    findAllForAdmin(): Promise<TemplateDefinition[]>;
    create(dto: CreateTemplateDto): Promise<TemplateDefinition>;
    setActive(id: string, isActive: boolean): Promise<TemplateDefinition>;
    seed(): Promise<{
        inserted: number;
        total: number;
    }>;
}
