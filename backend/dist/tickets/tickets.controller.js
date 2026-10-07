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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
const decorators_1 = require("../auth/decorators");
let TicketsController = class TicketsController {
    constructor(service) {
        this.service = service;
    }
    setEnabled(id, enabled, user) {
        return this.service.setTicketsEnabled(id, user.id, !!enabled);
    }
    assignStaff(id, email, user) {
        return this.service.assignStaff(id, user.id, email ?? '');
    }
    getPass(accessToken) {
        return this.service.getGuestPass(accessToken);
    }
    inspect(ticketToken, user) {
        return this.service.inspect(ticketToken, user);
    }
    checkIn(ticketToken, user) {
        return this.service.checkIn(ticketToken, user);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Patch)('invitations/:id/tickets'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('enabled')),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "setEnabled", null);
__decorate([
    (0, common_1.Post)('invitations/:id/staff'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('email')),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "assignStaff", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)('pass/:accessToken'),
    __param(0, (0, common_1.Param)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getPass", null);
__decorate([
    (0, common_1.Get)('tickets/:ticketToken'),
    __param(0, (0, common_1.Param)('ticketToken')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "inspect", null);
__decorate([
    (0, common_1.Post)('tickets/:ticketToken/checkin'),
    __param(0, (0, common_1.Param)('ticketToken')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "checkIn", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map