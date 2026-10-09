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
exports.InvitationsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const invitations_service_1 = require("./invitations.service");
const pdf_service_1 = require("./pdf.service");
const cloudinary_service_1 = require("./cloudinary.service");
const create_invitation_dto_1 = require("./dto/create-invitation.dto");
const update_invitation_dto_1 = require("./dto/update-invitation.dto");
const decorators_1 = require("../auth/decorators");
const imageUpload = {
    storage: (0, multer_1.memoryStorage)(),
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
let InvitationsController = class InvitationsController {
    constructor(service, pdf, cloudinary) {
        this.service = service;
        this.pdf = pdf;
        this.cloudinary = cloudinary;
    }
    create(dto, user) {
        return this.service.createDraft(dto, user.id);
    }
    listMine(user) {
        return this.service.listByOwner(user.id);
    }
    findOne(id, user) {
        return this.service.findOwned(id, user.id);
    }
    async downloadPdf(id, user, res, size) {
        const invitation = await this.service.findOwned(id, user.id);
        const resolved = this.pdf.resolveSize(size);
        const buffer = await this.pdf.buildInvitationPdf(invitation, resolved);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="invitacion-${resolved}.pdf"`,
        });
        res.send(buffer);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user.id);
    }
    async uploadImage(id, file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No se recibió ninguna imagen');
        }
        await this.service.findOwned(id, user.id);
        if (this.cloudinary.isConfigured()) {
            try {
                const url = await this.cloudinary.uploadImage(file.buffer);
                return { url };
            }
            catch (e) {
                const detail = e?.message ?? 'error desconocido';
                throw new common_1.BadRequestException(`No se pudo subir la imagen a Cloudinary: ${detail}`);
            }
        }
        const name = (0, crypto_1.randomBytes)(16).toString('hex') + (0, path_1.extname)(file.originalname).toLowerCase();
        await (0, promises_1.writeFile)((0, path_1.join)(process.cwd(), 'uploads', name), file.buffer);
        return { url: `/uploads/${name}` };
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invitation_dto_1.CreateInvitationDto, Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "listMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "downloadPdf", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_invitation_dto_1.UpdateInvitationDto, Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/upload-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', imageUpload)),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "uploadImage", null);
exports.InvitationsController = InvitationsController = __decorate([
    (0, common_1.Controller)('invitations'),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService,
        pdf_service_1.PdfService,
        cloudinary_service_1.CloudinaryService])
], InvitationsController);
//# sourceMappingURL=invitations.controller.js.map