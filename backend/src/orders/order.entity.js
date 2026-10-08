"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderKind = exports.PaymentProvider = exports.OrderStatus = void 0;
var typeorm_1 = require("typeorm");
var invitation_entity_1 = require("../invitations/invitation.entity");
// Estado del pedido/pago.
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "pending";
    OrderStatus["Paid"] = "paid";
    OrderStatus["Refunded"] = "refunded";
    OrderStatus["Canceled"] = "canceled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
// Proveedor de pago usado para el pedido.
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["Stripe"] = "stripe";
    PaymentProvider["Simulated"] = "simulated";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
// Qué se está pagando con este pedido.
var OrderKind;
(function (OrderKind) {
    OrderKind["InvitationPublish"] = "invitation_publish";
    OrderKind["DesignService"] = "design_service";
})(OrderKind || (exports.OrderKind = OrderKind = {}));
// Pedido/transacción comercial. Puede apuntar a una invitación (publicación)
// o a una solicitud de diseño a medida, según el 'kind'.
var Order = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('orders')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _kind_decorators;
    var _kind_initializers = [];
    var _kind_extraInitializers = [];
    var _invitation_decorators;
    var _invitation_initializers = [];
    var _invitation_extraInitializers = [];
    var _invitationId_decorators;
    var _invitationId_initializers = [];
    var _invitationId_extraInitializers = [];
    var _designRequestId_decorators;
    var _designRequestId_initializers = [];
    var _designRequestId_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _provider_decorators;
    var _provider_initializers = [];
    var _provider_extraInitializers = [];
    var _paymentRef_decorators;
    var _paymentRef_initializers = [];
    var _paymentRef_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Order = _classThis = /** @class */ (function () {
        function Order_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.kind = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _kind_initializers, void 0));
            // Invitación asociada (solo para kind=invitation_publish).
            this.invitation = (__runInitializers(this, _kind_extraInitializers), __runInitializers(this, _invitation_initializers, void 0));
            this.invitationId = (__runInitializers(this, _invitation_extraInitializers), __runInitializers(this, _invitationId_initializers, void 0));
            // Solicitud de diseño asociada (solo para kind=design_service).
            this.designRequestId = (__runInitializers(this, _invitationId_extraInitializers), __runInitializers(this, _designRequestId_initializers, void 0));
            // Monto en la unidad menor (centavos) para evitar errores de redondeo.
            this.amount = (__runInitializers(this, _designRequestId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.status = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.provider = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
            // Referencia del proveedor (id de la sesión de Checkout o del PaymentIntent).
            this.paymentRef = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _paymentRef_initializers, void 0));
            this.createdAt = (__runInitializers(this, _paymentRef_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return Order_1;
    }());
    __setFunctionName(_classThis, "Order");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _kind_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: OrderKind, default: OrderKind.InvitationPublish })];
        _invitation_decorators = [(0, typeorm_1.ManyToOne)(function () { return invitation_entity_1.Invitation; }, { eager: true, onDelete: 'CASCADE', nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'invitation_id' })];
        _invitationId_decorators = [(0, typeorm_1.Column)({ name: 'invitation_id', nullable: true })];
        _designRequestId_decorators = [(0, typeorm_1.Column)({ name: 'design_request_id', type: 'uuid', nullable: true })];
        _amount_decorators = [(0, typeorm_1.Column)({ type: 'int' })];
        _currency_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'MXN' })];
        _status_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })];
        _provider_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: PaymentProvider })];
        _paymentRef_decorators = [(0, typeorm_1.Column)({ name: 'payment_ref', type: 'varchar', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _kind_decorators, { kind: "field", name: "kind", static: false, private: false, access: { has: function (obj) { return "kind" in obj; }, get: function (obj) { return obj.kind; }, set: function (obj, value) { obj.kind = value; } }, metadata: _metadata }, _kind_initializers, _kind_extraInitializers);
        __esDecorate(null, null, _invitation_decorators, { kind: "field", name: "invitation", static: false, private: false, access: { has: function (obj) { return "invitation" in obj; }, get: function (obj) { return obj.invitation; }, set: function (obj, value) { obj.invitation = value; } }, metadata: _metadata }, _invitation_initializers, _invitation_extraInitializers);
        __esDecorate(null, null, _invitationId_decorators, { kind: "field", name: "invitationId", static: false, private: false, access: { has: function (obj) { return "invitationId" in obj; }, get: function (obj) { return obj.invitationId; }, set: function (obj, value) { obj.invitationId = value; } }, metadata: _metadata }, _invitationId_initializers, _invitationId_extraInitializers);
        __esDecorate(null, null, _designRequestId_decorators, { kind: "field", name: "designRequestId", static: false, private: false, access: { has: function (obj) { return "designRequestId" in obj; }, get: function (obj) { return obj.designRequestId; }, set: function (obj, value) { obj.designRequestId = value; } }, metadata: _metadata }, _designRequestId_initializers, _designRequestId_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: function (obj) { return "provider" in obj; }, get: function (obj) { return obj.provider; }, set: function (obj, value) { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
        __esDecorate(null, null, _paymentRef_decorators, { kind: "field", name: "paymentRef", static: false, private: false, access: { has: function (obj) { return "paymentRef" in obj; }, get: function (obj) { return obj.paymentRef; }, set: function (obj, value) { obj.paymentRef = value; } }, metadata: _metadata }, _paymentRef_initializers, _paymentRef_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Order = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Order = _classThis;
}();
exports.Order = Order;
