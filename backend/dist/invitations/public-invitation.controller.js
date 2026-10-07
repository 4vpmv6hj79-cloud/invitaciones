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
exports.PublicInvitationController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const invitations_service_1 = require("./invitations.service");
const decorators_1 = require("../auth/decorators");
let PublicInvitationController = class PublicInvitationController {
    constructor(service, config) {
        this.service = service;
        this.config = config;
    }
    findByToken(token) {
        return this.service.findPublicByToken(token);
    }
    async image(token) {
        return this.service.buildShareSvg(token);
    }
    async imagePng(token, res) {
        const buffer = await this.service.buildSharePng(token);
        res.send(buffer);
    }
    async share(token, res) {
        const frontendUrl = this.config.get('FRONTEND_URL') ?? 'http://localhost:4300';
        const backendUrl = this.config.get('PUBLIC_API_URL') ?? 'http://localhost:3100';
        let title = 'Invitación';
        let description = 'Te invitamos a nuestro evento';
        try {
            const data = await this.service.findPublicByToken(token);
            title = data.title || title;
            const d = data.data;
            description = [d.coupleOrHonoree, d.date].filter(Boolean).join(' · ') || description;
        }
        catch {
        }
        const safeTitle = this.escapeHtml(title);
        const safeDesc = this.escapeHtml(description);
        const imageUrl = `${backendUrl}/p/${encodeURIComponent(token)}/image.png`;
        const appUrl = `${frontendUrl}/i/${encodeURIComponent(token)}`;
        res.send(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${safeTitle}</title>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${safeTitle}"/>
<meta property="og:description" content="${safeDesc}"/>
<meta property="og:image" content="${imageUrl}"/>
<meta property="og:url" content="${appUrl}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta http-equiv="refresh" content="0; url=${appUrl}"/>
</head>
<body>
<p>Redirigiendo a la invitación… <a href="${appUrl}">Abrir invitación</a></p>
</body>
</html>`);
    }
    escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
};
exports.PublicInvitationController = PublicInvitationController;
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicInvitationController.prototype, "findByToken", null);
__decorate([
    (0, common_1.Get)(':token/image.svg'),
    (0, common_1.Header)('Content-Type', 'image/svg+xml'),
    (0, common_1.Header)('Cache-Control', 'public, max-age=300'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicInvitationController.prototype, "image", null);
__decorate([
    (0, common_1.Get)(':token/image.png'),
    (0, common_1.Header)('Content-Type', 'image/png'),
    (0, common_1.Header)('Cache-Control', 'public, max-age=300'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicInvitationController.prototype, "imagePng", null);
__decorate([
    (0, common_1.Get)(':token/share'),
    (0, common_1.Header)('Content-Type', 'text/html; charset=utf-8'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicInvitationController.prototype, "share", null);
exports.PublicInvitationController = PublicInvitationController = __decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Controller)('p'),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService,
        config_1.ConfigService])
], PublicInvitationController);
//# sourceMappingURL=public-invitation.controller.js.map