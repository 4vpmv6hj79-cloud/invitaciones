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
exports.AccessAssignment = void 0;
const typeorm_1 = require("typeorm");
let AccessAssignment = class AccessAssignment {
};
exports.AccessAssignment = AccessAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AccessAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invitation_id', type: 'uuid' }),
    __metadata("design:type", String)
], AccessAssignment.prototype, "invitationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], AccessAssignment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccessAssignment.prototype, "createdAt", void 0);
exports.AccessAssignment = AccessAssignment = __decorate([
    (0, typeorm_1.Entity)('access_assignments'),
    (0, typeorm_1.Index)(['invitationId', 'userId'], { unique: true })
], AccessAssignment);
//# sourceMappingURL=access-assignment.entity.js.map