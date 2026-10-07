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
exports.AdminDesignController = void 0;
const common_1 = require("@nestjs/common");
const design_service_1 = require("./design.service");
const design_request_entity_1 = require("./design-request.entity");
const post_message_dto_1 = require("./dto/post-message.dto");
const decorators_1 = require("../auth/decorators");
const user_entity_1 = require("../auth/user.entity");
let AdminDesignController = class AdminDesignController {
    constructor(service) {
        this.service = service;
    }
    list(status) {
        return this.service.listAll(status);
    }
    getThread(id, user) {
        return this.service.getThread(id, user);
    }
    listReferences(id, user) {
        return this.service.listReferences(id, user);
    }
    setStatus(id, status) {
        return this.service.setStatus(id, status);
    }
    addProposal(id, dto, priceCents, user) {
        return this.service.addProposal(id, user.id, dto, Number(priceCents));
    }
};
exports.AdminDesignController = AdminDesignController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminDesignController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminDesignController.prototype, "getThread", null);
__decorate([
    (0, common_1.Get)(':id/references'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminDesignController.prototype, "listReferences", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminDesignController.prototype, "setStatus", null);
__decorate([
    (0, common_1.Post)(':id/proposal'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('priceCents')),
    __param(3, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, post_message_dto_1.PostMessageDto, Number, Object]),
    __metadata("design:returntype", void 0)
], AdminDesignController.prototype, "addProposal", null);
exports.AdminDesignController = AdminDesignController = __decorate([
    (0, decorators_1.Roles)(user_entity_1.UserRole.Admin),
    (0, common_1.Controller)('admin/design-requests'),
    __metadata("design:paramtypes", [design_service_1.DesignService])
], AdminDesignController);
//# sourceMappingURL=admin-design.controller.js.map