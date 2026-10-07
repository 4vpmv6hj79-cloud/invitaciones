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
exports.RsvpController = void 0;
const common_1 = require("@nestjs/common");
const guests_service_1 = require("./guests.service");
const invitations_service_1 = require("../invitations/invitations.service");
const rsvp_dto_1 = require("./dto/rsvp.dto");
const public_rsvp_dto_1 = require("./dto/public-rsvp.dto");
const decorators_1 = require("../auth/decorators");
let RsvpController = class RsvpController {
    constructor(guests, invitations) {
        this.guests = guests;
        this.invitations = invitations;
    }
    publicRsvp(publicToken, dto) {
        return this.guests.publicRsvp(publicToken, dto);
    }
    async view(token) {
        const guest = await this.guests.getByToken(token);
        const invitation = await this.invitations.findOne(guest.invitationId);
        return {
            guest: {
                name: guest.name,
                allowedSeats: guest.allowedSeats,
                rsvpMode: guest.rsvpMode,
                rsvpStatus: guest.rsvpStatus,
                confirmedSeats: guest.confirmedSeats,
                dietaryNotes: guest.dietaryNotes ?? null,
            },
            invitation: {
                title: invitation.event.title,
                eventType: invitation.event.type,
                data: invitation.event.data,
                customization: invitation.customization,
                status: invitation.status,
            },
        };
    }
    async respond(token, dto) {
        const guest = await this.guests.respond(token, dto);
        return {
            rsvpStatus: guest.rsvpStatus,
            confirmedSeats: guest.confirmedSeats,
        };
    }
};
exports.RsvpController = RsvpController;
__decorate([
    (0, common_1.Post)('public/:publicToken'),
    __param(0, (0, common_1.Param)('publicToken')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, public_rsvp_dto_1.PublicRsvpDto]),
    __metadata("design:returntype", void 0)
], RsvpController.prototype, "publicRsvp", null);
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RsvpController.prototype, "view", null);
__decorate([
    (0, common_1.Post)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rsvp_dto_1.RsvpDto]),
    __metadata("design:returntype", Promise)
], RsvpController.prototype, "respond", null);
exports.RsvpController = RsvpController = __decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Controller)('rsvp'),
    __metadata("design:paramtypes", [guests_service_1.GuestsService,
        invitations_service_1.InvitationsService])
], RsvpController);
//# sourceMappingURL=rsvp.controller.js.map