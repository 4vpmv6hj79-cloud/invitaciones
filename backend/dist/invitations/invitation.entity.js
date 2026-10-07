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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invitation = exports.InvitationStatus = void 0;
const typeorm_1 = require("typeorm");
const template_entity_1 = require("../templates/template.entity");
const event_entity_1 = require("./event.entity");
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["Draft"] = "draft";
    InvitationStatus["Published"] = "published";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
let Invitation = class Invitation {
};
exports.Invitation = Invitation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Invitation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => template_entity_1.TemplateDefinition, { eager: true, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'template_id' }),
    __metadata("design:type", template_entity_1.TemplateDefinition)
], Invitation.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id' }),
    __metadata("design:type", String)
], Invitation.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Invitation.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tickets_enabled', default: false }),
    __metadata("design:type", Boolean)
], Invitation.prototype, "ticketsEnabled", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => event_entity_1.Event, (event) => event.invitation, {
        cascade: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_1.Event)
], Invitation.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], Invitation.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Invitation.prototype, "customization", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.Draft }),
    __metadata("design:type", String)
], Invitation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'public_token', type: 'varchar', length: 64, nullable: true, unique: true }),
    __metadata("design:type", Object)
], Invitation.prototype, "publicToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Invitation.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Invitation.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Invitation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Invitation.prototype, "updatedAt", void 0);
exports.Invitation = Invitation = __decorate([
    (0, typeorm_1.Entity)('invitations')
], Invitation);
//# sourceMappingURL=invitation.entity.js.map