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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const templates_service_1 = require("./templates.service");
const query_templates_dto_1 = require("./dto/query-templates.dto");
const create_template_dto_1 = require("./dto/create-template.dto");
const template_enums_1 = require("./template.enums");
const decorators_1 = require("../auth/decorators");
const user_entity_1 = require("../auth/user.entity");
let TemplatesController = class TemplatesController {
    constructor(service) {
        this.service = service;
    }
    findCatalog(query) {
        return this.service.findCatalog(query);
    }
    getFilters() {
        const toList = (labels) => Object.entries(labels).map(([value, label]) => ({ value, label }));
        return {
            eventTypes: toList(template_enums_1.EVENT_TYPE_LABELS),
            formats: toList(template_enums_1.TEMPLATE_FORMAT_LABELS),
            styles: toList(template_enums_1.TEMPLATE_STYLE_LABELS),
        };
    }
    findAllForAdmin() {
        return this.service.findAllForAdmin();
    }
    create(dto) {
        return this.service.create(dto);
    }
    setActive(id, isActive) {
        return this.service.setActive(id, isActive);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_templates_dto_1.QueryTemplatesDto]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "findCatalog", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)('filters'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "getFilters", null);
__decorate([
    (0, decorators_1.Roles)(user_entity_1.UserRole.Admin),
    (0, common_1.Get)('admin/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "findAllForAdmin", null);
__decorate([
    (0, decorators_1.Roles)(user_entity_1.UserRole.Admin),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "create", null);
__decorate([
    (0, decorators_1.Roles)(user_entity_1.UserRole.Admin),
    (0, common_1.Patch)(':id/active'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "setActive", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "findOne", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService])
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map