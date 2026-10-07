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
exports.TemplateDefinition = void 0;
const typeorm_1 = require("typeorm");
const template_enums_1 = require("./template.enums");
let TemplateDefinition = class TemplateDefinition {
};
exports.TemplateDefinition = TemplateDefinition;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TemplateDefinition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], TemplateDefinition.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], TemplateDefinition.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: template_enums_1.EventType, array: true }),
    __metadata("design:type", Array)
], TemplateDefinition.prototype, "eventTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: template_enums_1.TemplateFormat }),
    __metadata("design:type", String)
], TemplateDefinition.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: template_enums_1.TemplateStyle }),
    __metadata("design:type", String)
], TemplateDefinition.prototype, "style", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], TemplateDefinition.prototype, "previewUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], TemplateDefinition.prototype, "schema", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], TemplateDefinition.prototype, "theme", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], TemplateDefinition.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TemplateDefinition.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TemplateDefinition.prototype, "updatedAt", void 0);
exports.TemplateDefinition = TemplateDefinition = __decorate([
    (0, typeorm_1.Entity)('templates')
], TemplateDefinition);
//# sourceMappingURL=template.entity.js.map