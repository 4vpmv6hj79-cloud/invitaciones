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
exports.DesignService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const design_request_entity_1 = require("./design-request.entity");
const design_message_entity_1 = require("./design-message.entity");
const design_reference_entity_1 = require("./design-reference.entity");
let DesignService = class DesignService {
    constructor(requests, messages, references) {
        this.requests = requests;
        this.messages = messages;
        this.references = references;
        this.MAX_REFERENCES = 6;
    }
    async assertAccess(id, user) {
        const request = await this.requests.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (user.role !== 'admin' && request.requesterId !== user.id) {
            throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
        }
        return request;
    }
    async addReference(id, user, filename) {
        try {
            await this.assertAccess(id, user);
        }
        catch (err) {
            await this.safeUnlink(filename);
            throw err;
        }
        const count = await this.references.count({ where: { requestId: id } });
        if (count >= this.MAX_REFERENCES) {
            await this.safeUnlink(filename);
            throw new common_1.BadRequestException(`Máximo ${this.MAX_REFERENCES} imágenes por solicitud`);
        }
        return this.references.save(this.references.create({
            requestId: id,
            filename,
            url: `/uploads/${filename}`,
        }));
    }
    async listReferences(id, user) {
        await this.assertAccess(id, user);
        return this.references.find({ where: { requestId: id }, order: { createdAt: 'ASC' } });
    }
    async removeReference(id, refId, user) {
        await this.assertAccess(id, user);
        const ref = await this.references.findOne({ where: { id: refId, requestId: id } });
        if (!ref) {
            throw new common_1.NotFoundException('Imagen no encontrada');
        }
        await this.references.remove(ref);
        await this.safeUnlink(ref.filename);
    }
    async safeUnlink(filename) {
        try {
            await (0, promises_1.unlink)((0, path_1.join)(process.cwd(), 'uploads', filename));
        }
        catch {
        }
    }
    async createRequest(requesterId, dto) {
        return this.requests.save(this.requests.create({
            requesterId,
            title: dto.title,
            eventType: dto.eventType,
            style: dto.style ?? '',
            details: dto.details,
            budget: dto.budget ?? null,
            status: design_request_entity_1.DesignStatus.Nueva,
        }));
    }
    async listMine(requesterId) {
        return this.requests.find({
            where: { requesterId },
            order: { createdAt: 'DESC' },
        });
    }
    async getThread(id, user) {
        const request = await this.requests.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (user.role !== 'admin' && request.requesterId !== user.id) {
            throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
        }
        const messages = await this.messages.find({
            where: { requestId: id },
            order: { createdAt: 'ASC' },
        });
        return { request, messages };
    }
    async addClientMessage(id, userId, dto) {
        const request = await this.requests.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (request.requesterId !== userId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
        }
        if (request.status === design_request_entity_1.DesignStatus.Aprobada || request.status === design_request_entity_1.DesignStatus.Rechazada) {
            throw new common_1.BadRequestException('La solicitud ya está cerrada');
        }
        if (dto.requestChanges) {
            if (request.revisionsUsed >= request.revisionLimit) {
                throw new common_1.BadRequestException(`Alcanzaste el límite de ${request.revisionLimit} revisiones`);
            }
            request.revisionsUsed += 1;
            request.status = design_request_entity_1.DesignStatus.EnProceso;
            await this.requests.save(request);
        }
        return this.messages.save(this.messages.create({
            requestId: id,
            authorId: userId,
            authorRole: 'client',
            body: dto.body,
            isProposal: false,
        }));
    }
    async getPayable(id, userId) {
        const request = await this.requests.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (request.requesterId !== userId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
        }
        if (request.status !== design_request_entity_1.DesignStatus.Propuesta || !request.priceCents) {
            throw new common_1.BadRequestException('Esta solicitud no tiene una propuesta por pagar');
        }
        return request;
    }
    async markApprovedPaid(id) {
        const request = await this.requests.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        request.status = design_request_entity_1.DesignStatus.Aprobada;
        request.paid = true;
        return this.requests.save(request);
    }
    async requestAdjustment(id, userId, note) {
        const request = await this.requests.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (request.requesterId !== userId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
        }
        if (request.status !== design_request_entity_1.DesignStatus.Aprobada || !request.paid) {
            throw new common_1.BadRequestException('Solo puedes solicitar un ajuste con costo sobre un diseño aprobado y pagado');
        }
        request.status = design_request_entity_1.DesignStatus.AjusteSolicitado;
        request.paid = false;
        request.priceCents = null;
        await this.requests.save(request);
        return this.messages.save(this.messages.create({
            requestId: id,
            authorId: userId,
            authorRole: 'client',
            body: note || 'Solicito un ajuste adicional (con costo).',
            isProposal: false,
        }));
    }
    async listAll(status) {
        return this.requests.find({
            where: status ? { status } : {},
            order: { createdAt: 'DESC' },
        });
    }
    async setStatus(id, status) {
        const request = await this.requests.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        request.status = status;
        return this.requests.save(request);
    }
    async addProposal(id, adminId, dto, priceCents) {
        const request = await this.requests.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (!priceCents || priceCents < 100) {
            throw new common_1.BadRequestException('La propuesta debe incluir un precio válido (mínimo $1)');
        }
        request.status = design_request_entity_1.DesignStatus.Propuesta;
        request.priceCents = priceCents;
        request.paid = false;
        await this.requests.save(request);
        return this.messages.save(this.messages.create({
            requestId: id,
            authorId: adminId,
            authorRole: 'admin',
            body: dto.body,
            isProposal: true,
        }));
    }
};
exports.DesignService = DesignService;
exports.DesignService = DesignService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(design_request_entity_1.DesignRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(design_message_entity_1.DesignMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(design_reference_entity_1.DesignReference)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DesignService);
//# sourceMappingURL=design.service.js.map