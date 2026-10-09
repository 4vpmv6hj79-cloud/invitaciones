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
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    constructor(config) {
        this.logger = new common_1.Logger(CloudinaryService_1.name);
        const cloudName = config.get('CLOUDINARY_CLOUD_NAME')?.trim();
        const apiKey = config.get('CLOUDINARY_API_KEY')?.trim();
        const apiSecret = config.get('CLOUDINARY_API_SECRET')?.trim();
        this.configured = Boolean(cloudName && apiKey && apiSecret);
        if (this.configured) {
            cloudinary_1.v2.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
                secure: true,
            });
            this.logger.log(`Cloudinary configurado (cloud: ${cloudName}).`);
        }
        else {
            this.logger.warn('Cloudinary NO está configurado. Faltan variables: ' +
                [
                    cloudName ? null : 'CLOUDINARY_CLOUD_NAME',
                    apiKey ? null : 'CLOUDINARY_API_KEY',
                    apiSecret ? null : 'CLOUDINARY_API_SECRET',
                ]
                    .filter(Boolean)
                    .join(', ') +
                '. Se usará almacenamiento local (efímero en Render).');
        }
    }
    isConfigured() {
        return this.configured;
    }
    uploadImage(buffer) {
        return new Promise((resolve, reject) => {
            let settled = false;
            const timer = setTimeout(() => {
                if (settled)
                    return;
                settled = true;
                this.logger.error('La subida a Cloudinary excedió el tiempo de espera (30s).');
                reject(new Error('La subida a Cloudinary tardó demasiado; inténtalo de nuevo.'));
            }, 30_000);
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'invitaciones', resource_type: 'image' }, (error, result) => {
                if (settled)
                    return;
                settled = true;
                clearTimeout(timer);
                if (error || !result) {
                    this.logger.error(`Error al subir a Cloudinary: ${JSON.stringify(error) || 'sin resultado'}`);
                    reject(error ?? new Error('Cloudinary no devolvió resultado'));
                    return;
                }
                resolve(result.secure_url);
            });
            stream.on('error', (err) => {
                if (settled)
                    return;
                settled = true;
                clearTimeout(timer);
                this.logger.error(`Error de stream hacia Cloudinary: ${err?.message ?? err}`);
                reject(err);
            });
            stream.end(buffer);
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map