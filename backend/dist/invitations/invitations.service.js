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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const sharp_1 = __importDefault(require("sharp"));
const invitation_entity_1 = require("./invitation.entity");
const event_entity_1 = require("./event.entity");
const template_entity_1 = require("../templates/template.entity");
let InvitationsService = class InvitationsService {
    constructor(invitations, events, templates) {
        this.invitations = invitations;
        this.events = events;
        this.templates = templates;
    }
    async createDraft(dto, ownerId) {
        const template = await this.templates.findOne({ where: { id: dto.templateId } });
        if (!template) {
            throw new common_1.NotFoundException('Plantilla no encontrada');
        }
        const event = this.events.create({
            type: template.eventTypes[0],
            title: dto.title ?? '',
            data: {},
        });
        const invitation = this.invitations.create({
            templateId: template.id,
            ownerId,
            event,
            customization: { ...template.theme },
        });
        return this.invitations.save(invitation);
    }
    async findOne(id) {
        const invitation = await this.invitations.findOne({ where: { id } });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitación no encontrada');
        }
        return invitation;
    }
    async findOwned(id, ownerId) {
        const invitation = await this.findOne(id);
        if (invitation.ownerId && invitation.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta invitación');
        }
        return invitation;
    }
    async listByOwner(ownerId) {
        return this.invitations.find({
            where: { ownerId },
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, dto, ownerId) {
        const invitation = await this.findOwned(id, ownerId);
        if (dto.title !== undefined) {
            invitation.event.title = dto.title;
        }
        if (dto.eventData) {
            invitation.event.data = { ...invitation.event.data, ...dto.eventData };
        }
        if (dto.customization) {
            invitation.customization = { ...invitation.customization, ...dto.customization };
        }
        await this.events.save(invitation.event);
        return this.invitations.save(invitation);
    }
    async publish(id, validityDays) {
        const invitation = await this.findOne(id);
        if (invitation.status !== invitation_entity_1.InvitationStatus.Published) {
            invitation.status = invitation_entity_1.InvitationStatus.Published;
            invitation.publicToken = (0, crypto_1.randomBytes)(24).toString('hex');
            invitation.publishedAt = new Date();
            const expires = new Date();
            expires.setDate(expires.getDate() + validityDays);
            invitation.expiresAt = expires;
            await this.invitations.save(invitation);
        }
        return invitation;
    }
    async getPublishedByToken(token) {
        const invitation = await this.invitations.findOne({
            where: { publicToken: token, status: invitation_entity_1.InvitationStatus.Published },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitación no encontrada');
        }
        return invitation;
    }
    async buildShareSvg(token) {
        const inv = await this.getPublishedByToken(token);
        const c = inv.customization;
        const d = inv.event.data;
        const bg = c.background || '#faf7ef';
        const primary = c.primary || '#b8860b';
        const secondary = c.secondary || '#7a5c13';
        const title = this.escapeXml(inv.event.title || 'Invitación');
        const names = this.escapeXml(d.coupleOrHonoree || '');
        const when = this.escapeXml([d.date, d.time ? `${d.time} h` : ''].filter(Boolean).join(' · '));
        const where = this.escapeXml(d.locationName || '');
        return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="${primary}" stroke-width="3" rx="16"/>
  <text x="600" y="200" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${secondary}" letter-spacing="4">TE INVITAMOS A</text>
  <text x="600" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="${primary}">${title}</text>
  ${names ? `<text x="600" y="370" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="${secondary}">${names}</text>` : ''}
  <line x1="520" y1="410" x2="680" y2="410" stroke="${primary}" stroke-width="2"/>
  ${when ? `<text x="600" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${secondary}">${when}</text>` : ''}
  ${where ? `<text x="600" y="520" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="${secondary}">${where}</text>` : ''}
</svg>`;
    }
    async buildSharePng(token) {
        const svg = await this.buildShareSvg(token);
        return (0, sharp_1.default)(Buffer.from(svg)).png().toBuffer();
    }
    escapeXml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    async findPublicByToken(token) {
        const invitation = await this.invitations.findOne({
            where: { publicToken: token, status: invitation_entity_1.InvitationStatus.Published },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitación no encontrada');
        }
        const expired = invitation.expiresAt ? invitation.expiresAt < new Date() : false;
        return {
            title: invitation.event.title,
            eventType: invitation.event.type,
            data: invitation.event.data,
            customization: invitation.customization,
            expired,
        };
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invitation_entity_1.Invitation)),
    __param(1, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(2, (0, typeorm_1.InjectRepository)(template_entity_1.TemplateDefinition)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map