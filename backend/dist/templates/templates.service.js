"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const template_entity_1 = require("./template.entity");
const templates_seed_data_1 = require("./templates.seed-data");
let TemplatesService = class TemplatesService {
    constructor(repo) {
        this.repo = repo;
    }
    async findCatalog(query) {
        const qb = this.repo
            .createQueryBuilder('t')
            .where('t.isActive = :active', { active: true });
        if (query.style) {
            qb.andWhere('t.style = :style', { style: query.style });
        }
        if (query.format) {
            qb.andWhere('t.format = :format', { format: query.format });
        }
        if (query.eventType) {
            qb.andWhere(':eventType = ANY(t.eventTypes)', { eventType: query.eventType });
        }
        return qb.orderBy('t.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        const template = await this.repo.findOne({ where: { id } });
        if (!template) {
            throw new common_1.NotFoundException('Plantilla no encontrada');
        }
        return template;
    }
    async findAllForAdmin() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    async create(dto) {
        const template = this.repo.create(dto);
        return this.repo.save(template);
    }
    async setActive(id, isActive) {
        const template = await this.findOne(id);
        template.isActive = isActive;
        return this.repo.save(template);
    }
    async seed() {
        let inserted = 0;
        for (const seed of templates_seed_data_1.SEED_TEMPLATES) {
            const exists = await this.repo.findOne({ where: { name: seed.name } });
            if (!exists) {
                await this.repo.save(this.repo.create(seed));
                inserted += 1;
            }
        }
        const total = await this.repo.count();
        return { inserted, total };
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_entity_1.TemplateDefinition)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map