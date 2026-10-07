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
exports.Guest = exports.GuestRsvpMode = exports.RsvpStatus = void 0;
const typeorm_1 = require("typeorm");
const invitation_entity_1 = require("../invitations/invitation.entity");
const guest_group_entity_1 = require("./guest-group.entity");
var RsvpStatus;
(function (RsvpStatus) {
    RsvpStatus["Pending"] = "pending";
    RsvpStatus["Confirmed"] = "confirmed";
    RsvpStatus["Declined"] = "declined";
})(RsvpStatus || (exports.RsvpStatus = RsvpStatus = {}));
var GuestRsvpMode;
(function (GuestRsvpMode) {
    GuestRsvpMode["Abierto"] = "abierto";
    GuestRsvpMode["Cerrado"] = "cerrado";
})(GuestRsvpMode || (exports.GuestRsvpMode = GuestRsvpMode = {}));
let Guest = class Guest {
};
exports.Guest = Guest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Guest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invitation_entity_1.Invitation, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'invitation_id' }),
    __metadata("design:type", invitation_entity_1.Invitation)
], Guest.prototype, "invitation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invitation_id' }),
    __metadata("design:type", String)
], Guest.prototype, "invitationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guest_group_entity_1.GuestGroup, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", Object)
], Guest.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_id', nullable: true }),
    __metadata("design:type", Object)
], Guest.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 160 }),
    __metadata("design:type", String)
], Guest.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 160, nullable: true }),
    __metadata("design:type", Object)
], Guest.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_seats', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Guest.prototype, "allowedSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rsvp_mode', type: 'enum', enum: GuestRsvpMode, default: GuestRsvpMode.Abierto }),
    __metadata("design:type", String)
], Guest.prototype, "rsvpMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rsvp_status', type: 'enum', enum: RsvpStatus, default: RsvpStatus.Pending }),
    __metadata("design:type", String)
], Guest.prototype, "rsvpStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmed_seats', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Guest.prototype, "confirmedSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dietary_notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Guest.prototype, "dietaryNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_token', type: 'varchar', length: 48, unique: true }),
    __metadata("design:type", String)
], Guest.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_token', type: 'varchar', length: 48, nullable: true, unique: true }),
    __metadata("design:type", Object)
], Guest.prototype, "ticketToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checked_in_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Guest.prototype, "checkedInAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'responded_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Guest.prototype, "respondedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Guest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Guest.prototype, "updatedAt", void 0);
exports.Guest = Guest = __decorate([
    (0, typeorm_1.Entity)('guests')
], Guest);
//# sourceMappingURL=guest.entity.js.map