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
exports.Order = exports.OrderKind = exports.PaymentProvider = exports.OrderStatus = void 0;
const typeorm_1 = require("typeorm");
const invitation_entity_1 = require("../invitations/invitation.entity");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "pending";
    OrderStatus["Paid"] = "paid";
    OrderStatus["Refunded"] = "refunded";
    OrderStatus["Canceled"] = "canceled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["Stripe"] = "stripe";
    PaymentProvider["Simulated"] = "simulated";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
var OrderKind;
(function (OrderKind) {
    OrderKind["InvitationPublish"] = "invitation_publish";
    OrderKind["DesignService"] = "design_service";
})(OrderKind || (exports.OrderKind = OrderKind = {}));
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OrderKind, default: OrderKind.InvitationPublish }),
    __metadata("design:type", String)
], Order.prototype, "kind", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invitation_entity_1.Invitation, { eager: true, onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'invitation_id' }),
    __metadata("design:type", Object)
], Order.prototype, "invitation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invitation_id', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "invitationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'design_request_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "designRequestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'MXN' }),
    __metadata("design:type", String)
], Order.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentProvider }),
    __metadata("design:type", String)
], Order.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_ref', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "paymentRef", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map