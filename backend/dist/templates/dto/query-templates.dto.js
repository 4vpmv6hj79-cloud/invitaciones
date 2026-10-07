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
exports.QueryTemplatesDto = void 0;
const class_validator_1 = require("class-validator");
const template_enums_1 = require("../template.enums");
class QueryTemplatesDto {
}
exports.QueryTemplatesDto = QueryTemplatesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(template_enums_1.EventType, { message: 'Tipo de evento no válido' }),
    __metadata("design:type", String)
], QueryTemplatesDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(template_enums_1.TemplateStyle, { message: 'Estilo no válido' }),
    __metadata("design:type", String)
], QueryTemplatesDto.prototype, "style", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(template_enums_1.TemplateFormat, { message: 'Formato no válido' }),
    __metadata("design:type", String)
], QueryTemplatesDto.prototype, "format", void 0);
//# sourceMappingURL=query-templates.dto.js.map