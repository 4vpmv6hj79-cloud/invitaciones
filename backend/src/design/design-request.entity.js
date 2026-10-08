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
exports.DesignRequest = exports.DesignStatus = void 0;
var typeorm_1 = require("typeorm");
// Estados del pedido de diseño a medida.
var DesignStatus;
(function (DesignStatus) {
    DesignStatus["Nueva"] = "nueva";
    DesignStatus["EnProceso"] = "en_proceso";
    DesignStatus["Propuesta"] = "propuesta";
    DesignStatus["Aprobada"] = "aprobada";
    DesignStatus["Rechazada"] = "rechazada";
    // Ajuste solicitado por el cliente DESPUÉS de aprobar y pagar (tiene costo adicional).
    DesignStatus["AjusteSolicitado"] = "ajuste_solicitado";
})(DesignStatus || (exports.DesignStatus = DesignStatus = {}));
// Solicitud de diseño por encargo hecha por un cliente (organizador).
var DesignRequest = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('design_requests')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _requesterId_decorators;
    var _requesterId_initializers = [];
    var _requesterId_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _eventType_decorators;
    var _eventType_initializers = [];
    var _eventType_extraInitializers = [];
    var _style_decorators;
    var _style_initializers = [];
    var _style_extraInitializers = [];
    var _details_decorators;
    var _details_initializers = [];
    var _details_extraInitializers = [];
    var _budget_decorators;
    var _budget_initializers = [];
    var _budget_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _priceCents_decorators;
    var _priceCents_initializers = [];
    var _priceCents_extraInitializers = [];
    var _paid_decorators;
    var _paid_initializers = [];
    var _paid_extraInitializers = [];
    var _revisionsUsed_decorators;
    var _revisionsUsed_initializers = [];
    var _revisionsUsed_extraInitializers = [];
    var _revisionLimit_decorators;
    var _revisionLimit_initializers = [];
    var _revisionLimit_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var DesignRequest = _classThis = /** @class */ (function () {
        function DesignRequest_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // Cliente que solicita (User). Separa el pedido de su dueño.
            this.requesterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requesterId_initializers, void 0));
            this.title = (__runInitializers(this, _requesterId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.eventType = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.style = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _style_initializers, void 0));
            this.details = (__runInitializers(this, _style_extraInitializers), __runInitializers(this, _details_initializers, void 0));
            // Presupuesto estimado del cliente, en texto libre (opcional).
            this.budget = (__runInitializers(this, _details_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
            this.status = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            // Precio de la propuesta actual, en centavos de MXN (lo fija el admin). Nulo si aún no hay.
            this.priceCents = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priceCents_initializers, void 0));
            // Si la propuesta actual ya fue pagada por el cliente.
            this.paid = (__runInitializers(this, _priceCents_extraInitializers), __runInitializers(this, _paid_initializers, void 0));
            // Control de revisiones: cuántas rondas de cambios ha pedido el cliente y el máximo.
            this.revisionsUsed = (__runInitializers(this, _paid_extraInitializers), __runInitializers(this, _revisionsUsed_initializers, void 0));
            this.revisionLimit = (__runInitializers(this, _revisionsUsed_extraInitializers), __runInitializers(this, _revisionLimit_initializers, void 0));
            this.createdAt = (__runInitializers(this, _revisionLimit_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return DesignRequest_1;
    }());
    __setFunctionName(_classThis, "DesignRequest");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _requesterId_decorators = [(0, typeorm_1.Column)({ name: 'requester_id', type: 'uuid' })];
        _title_decorators = [(0, typeorm_1.Column)({ length: 160 })];
        _eventType_decorators = [(0, typeorm_1.Column)({ length: 60 })];
        _style_decorators = [(0, typeorm_1.Column)({ length: 60, default: '' })];
        _details_decorators = [(0, typeorm_1.Column)({ type: 'text', default: '' })];
        _budget_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 120, nullable: true })];
        _status_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: DesignStatus, default: DesignStatus.Nueva })];
        _priceCents_decorators = [(0, typeorm_1.Column)({ name: 'price_cents', type: 'int', nullable: true })];
        _paid_decorators = [(0, typeorm_1.Column)({ default: false })];
        _revisionsUsed_decorators = [(0, typeorm_1.Column)({ name: 'revisions_used', type: 'int', default: 0 })];
        _revisionLimit_decorators = [(0, typeorm_1.Column)({ name: 'revision_limit', type: 'int', default: 2 })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requesterId_decorators, { kind: "field", name: "requesterId", static: false, private: false, access: { has: function (obj) { return "requesterId" in obj; }, get: function (obj) { return obj.requesterId; }, set: function (obj, value) { obj.requesterId = value; } }, metadata: _metadata }, _requesterId_initializers, _requesterId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: function (obj) { return "eventType" in obj; }, get: function (obj) { return obj.eventType; }, set: function (obj, value) { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _style_decorators, { kind: "field", name: "style", static: false, private: false, access: { has: function (obj) { return "style" in obj; }, get: function (obj) { return obj.style; }, set: function (obj, value) { obj.style = value; } }, metadata: _metadata }, _style_initializers, _style_extraInitializers);
        __esDecorate(null, null, _details_decorators, { kind: "field", name: "details", static: false, private: false, access: { has: function (obj) { return "details" in obj; }, get: function (obj) { return obj.details; }, set: function (obj, value) { obj.details = value; } }, metadata: _metadata }, _details_initializers, _details_extraInitializers);
        __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: function (obj) { return "budget" in obj; }, get: function (obj) { return obj.budget; }, set: function (obj, value) { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priceCents_decorators, { kind: "field", name: "priceCents", static: false, private: false, access: { has: function (obj) { return "priceCents" in obj; }, get: function (obj) { return obj.priceCents; }, set: function (obj, value) { obj.priceCents = value; } }, metadata: _metadata }, _priceCents_initializers, _priceCents_extraInitializers);
        __esDecorate(null, null, _paid_decorators, { kind: "field", name: "paid", static: false, private: false, access: { has: function (obj) { return "paid" in obj; }, get: function (obj) { return obj.paid; }, set: function (obj, value) { obj.paid = value; } }, metadata: _metadata }, _paid_initializers, _paid_extraInitializers);
        __esDecorate(null, null, _revisionsUsed_decorators, { kind: "field", name: "revisionsUsed", static: false, private: false, access: { has: function (obj) { return "revisionsUsed" in obj; }, get: function (obj) { return obj.revisionsUsed; }, set: function (obj, value) { obj.revisionsUsed = value; } }, metadata: _metadata }, _revisionsUsed_initializers, _revisionsUsed_extraInitializers);
        __esDecorate(null, null, _revisionLimit_decorators, { kind: "field", name: "revisionLimit", static: false, private: false, access: { has: function (obj) { return "revisionLimit" in obj; }, get: function (obj) { return obj.revisionLimit; }, set: function (obj, value) { obj.revisionLimit = value; } }, metadata: _metadata }, _revisionLimit_initializers, _revisionLimit_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DesignRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DesignRequest = _classThis;
}();
exports.DesignRequest = DesignRequest;
