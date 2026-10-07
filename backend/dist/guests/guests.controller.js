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
exports.GuestsController = void 0;
const common_1 = require("@nestjs/common");
const guests_service_1 = require("./guests.service");
const create_guest_dto_1 = require("./dto/create-guest.dto");
const create_group_dto_1 = require("./dto/create-group.dto");
const decorators_1 = require("../auth/decorators");
let GuestsController = class GuestsController {
    constructor(service) {
        this.service = service;
    }
    async createGuest(invitationId, dto, user) {
        await this.service.assertOwner(invitationId, user.id);
        return this.service.createGuest(invitationId, dto);
    }
    async createGroup(invitationId, dto, user) {
        await this.service.assertOwner(invitationId, user.id);
        return this.service.createGroup(invitationId, dto);
    }
    async list(invitationId, user) {
        await this.service.assertOwner(invitationId, user.id);
        return this.service.listGuests(invitationId);
    }
    async summary(invitationId, user) {
        await this.service.assertOwner(invitationId, user.id);
        return this.service.summary(invitationId);
    }
    async export(invitationId, user) {
        await this.service.assertOwner(invitationId, user.id);
        return this.service.exportCsv(invitationId);
    }
    async import(invitationId, csv, user) {
        await this.service.assertOwner(invitationId, user.id);
        return this.service.importCsv(invitationId, csv ?? '');
    }
    async remove(invitationId, guestId, user) {
        await this.service.assertOwner(invitationId, user.id);
        return this.service.removeGuest(invitationId, guestId);
    }
};
exports.GuestsController = GuestsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('invitationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_guest_dto_1.CreateGuestDto, Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "createGuest", null);
__decorate([
    (0, common_1.Post)('groups'),
    __param(0, (0, common_1.Param)('invitationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_group_dto_1.CreateGroupDto, Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('invitationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Param)('invitationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.Header)('Content-Type', 'text/csv; charset=utf-8'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="invitados.csv"'),
    __param(0, (0, common_1.Param)('invitationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "export", null);
__decorate([
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Param)('invitationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('csv')),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "import", null);
__decorate([
    (0, common_1.Delete)(':guestId'),
    __param(0, (0, common_1.Param)('invitationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('guestId', new common_1.ParseUUIDPipe())),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "remove", null);
exports.GuestsController = GuestsController = __decorate([
    (0, common_1.Controller)('invitations/:invitationId/guests'),
    __metadata("design:paramtypes", [guests_service_1.GuestsService])
], GuestsController);
//# sourceMappingURL=guests.controller.js.map