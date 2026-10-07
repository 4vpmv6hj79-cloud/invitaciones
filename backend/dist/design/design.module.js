"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const design_request_entity_1 = require("./design-request.entity");
const design_message_entity_1 = require("./design-message.entity");
const design_reference_entity_1 = require("./design-reference.entity");
const design_service_1 = require("./design.service");
const design_controller_1 = require("./design.controller");
const admin_design_controller_1 = require("./admin-design.controller");
let DesignModule = class DesignModule {
};
exports.DesignModule = DesignModule;
exports.DesignModule = DesignModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([design_request_entity_1.DesignRequest, design_message_entity_1.DesignMessage, design_reference_entity_1.DesignReference])],
        controllers: [design_controller_1.DesignController, admin_design_controller_1.AdminDesignController],
        providers: [design_service_1.DesignService],
        exports: [design_service_1.DesignService],
    })
], DesignModule);
//# sourceMappingURL=design.module.js.map