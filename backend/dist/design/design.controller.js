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
exports.DesignController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const path_1 = require("path");
const design_service_1 = require("./design.service");
const create_request_dto_1 = require("./dto/create-request.dto");
const post_message_dto_1 = require("./dto/post-message.dto");
const decorators_1 = require("../auth/decorators");
const imageUpload = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (_req, file, cb) => {
            const name = (0, crypto_1.randomBytes)(16).toString('hex') + (0, path_1.extname)(file.originalname).toLowerCase();
            cb(null, name);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new common_1.BadRequestException('Solo se permiten imágenes (jpg, png, webp, gif)'), false);
        }
    },
};
let DesignController = class DesignController {
    constructor(service) {
        this.service = service;
    }
    create(dto, user) {
        return this.service.createRequest(user.id, dto);
    }
    listMine(user) {
        return this.service.listMine(user.id);
    }
    getThread(id, user) {
        return this.service.getThread(id, user);
    }
    addMessage(id, dto, user) {
        return this.service.addClientMessage(id, user.id, dto);
    }
    requestAdjustment(id, note, user) {
        return this.service.requestAdjustment(id, user.id, note ?? '');
    }
    listReferences(id, user) {
        return this.service.listReferences(id, user);
    }
    uploadReference(id, file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No se recibió ninguna imagen');
        }
        return this.service.addReference(id, user, file.filename);
    }
    removeReference(id, refId, user) {
        return this.service.removeReference(id, refId, user);
    }
};
exports.DesignController = DesignController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_request_dto_1.CreateRequestDto, Object]),
    __metadata("design:returntype", void 0)
], DesignController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DesignController.prototype, "listMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DesignController.prototype, "getThread", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, post_message_dto_1.PostMessageDto, Object]),
    __metadata("design:returntype", void 0)
], DesignController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Post)(':id/request-adjustment'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('note')),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DesignController.prototype, "requestAdjustment", null);
__decorate([
    (0, common_1.Get)(':id/references'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DesignController.prototype, "listReferences", null);
__decorate([
    (0, common_1.Post)(':id/references'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', imageUpload)),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DesignController.prototype, "uploadReference", null);
__decorate([
    (0, common_1.Delete)(':id/references/:refId'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('refId', new common_1.ParseUUIDPipe())),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DesignController.prototype, "removeReference", null);
exports.DesignController = DesignController = __decorate([
    (0, common_1.Controller)('design-requests'),
    __metadata("design:paramtypes", [design_service_1.DesignService])
], DesignController);
//# sourceMappingURL=design.controller.js.map