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
exports.DesignMessage = void 0;
const typeorm_1 = require("typeorm");
const design_request_entity_1 = require("./design-request.entity");
let DesignMessage = class DesignMessage {
};
exports.DesignMessage = DesignMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DesignMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => design_request_entity_1.DesignRequest, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'request_id' }),
    __metadata("design:type", design_request_entity_1.DesignRequest)
], DesignMessage.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_id', type: 'uuid' }),
    __metadata("design:type", String)
], DesignMessage.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id', type: 'uuid' }),
    __metadata("design:type", String)
], DesignMessage.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_role', length: 20 }),
    __metadata("design:type", String)
], DesignMessage.prototype, "authorRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], DesignMessage.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_proposal', default: false }),
    __metadata("design:type", Boolean)
], DesignMessage.prototype, "isProposal", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DesignMessage.prototype, "createdAt", void 0);
exports.DesignMessage = DesignMessage = __decorate([
    (0, typeorm_1.Entity)('design_messages')
], DesignMessage);
//# sourceMappingURL=design-message.entity.js.map