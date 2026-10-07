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
exports.DesignRequest = exports.DesignStatus = void 0;
const typeorm_1 = require("typeorm");
var DesignStatus;
(function (DesignStatus) {
    DesignStatus["Nueva"] = "nueva";
    DesignStatus["EnProceso"] = "en_proceso";
    DesignStatus["Propuesta"] = "propuesta";
    DesignStatus["Aprobada"] = "aprobada";
    DesignStatus["Rechazada"] = "rechazada";
    DesignStatus["AjusteSolicitado"] = "ajuste_solicitado";
})(DesignStatus || (exports.DesignStatus = DesignStatus = {}));
let DesignRequest = class DesignRequest {
};
exports.DesignRequest = DesignRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DesignRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requester_id', type: 'uuid' }),
    __metadata("design:type", String)
], DesignRequest.prototype, "requesterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 160 }),
    __metadata("design:type", String)
], DesignRequest.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 60 }),
    __metadata("design:type", String)
], DesignRequest.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 60, default: '' }),
    __metadata("design:type", String)
], DesignRequest.prototype, "style", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], DesignRequest.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], DesignRequest.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DesignStatus, default: DesignStatus.Nueva }),
    __metadata("design:type", String)
], DesignRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_cents', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], DesignRequest.prototype, "priceCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DesignRequest.prototype, "paid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revisions_used', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DesignRequest.prototype, "revisionsUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revision_limit', type: 'int', default: 2 }),
    __metadata("design:type", Number)
], DesignRequest.prototype, "revisionLimit", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DesignRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DesignRequest.prototype, "updatedAt", void 0);
exports.DesignRequest = DesignRequest = __decorate([
    (0, typeorm_1.Entity)('design_requests')
], DesignRequest);
//# sourceMappingURL=design-request.entity.js.map