"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrdersController = void 0;
var common_1 = require("@nestjs/common");
var decorators_1 = require("../auth/decorators");
var user_entity_1 = require("../auth/user.entity");
// Panel de administración de pedidos. Solo rol admin (guard global + @Roles).
var AdminOrdersController = function () {
    var _classDecorators = [(0, decorators_1.Roles)(user_entity_1.UserRole.Admin), (0, common_1.Controller)('admin')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listOrders_decorators;
    var _getOrder_decorators;
    var _refund_decorators;
    var _salesReport_decorators;
    var AdminOrdersController = _classThis = /** @class */ (function () {
        function AdminOrdersController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        // Lista de pedidos, filtrable por estado. GET /admin/orders?status=paid
        AdminOrdersController_1.prototype.listOrders = function (status) {
            return this.service.listOrders(status);
        };
        // Detalle de un pedido. GET /admin/orders/:id
        AdminOrdersController_1.prototype.getOrder = function (id) {
            return this.service.findOne(id);
        };
        // Reembolsa un pedido pagado. POST /admin/orders/:id/refund
        AdminOrdersController_1.prototype.refund = function (id) {
            return this.service.refund(id);
        };
        // Reporte de ventas y costos estimados. GET /admin/reports/sales
        AdminOrdersController_1.prototype.salesReport = function () {
            return this.service.salesReport();
        };
        return AdminOrdersController_1;
    }());
    __setFunctionName(_classThis, "AdminOrdersController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listOrders_decorators = [(0, common_1.Get)('orders')];
        _getOrder_decorators = [(0, common_1.Get)('orders/:id')];
        _refund_decorators = [(0, common_1.Post)('orders/:id/refund')];
        _salesReport_decorators = [(0, common_1.Get)('reports/sales')];
        __esDecorate(_classThis, null, _listOrders_decorators, { kind: "method", name: "listOrders", static: false, private: false, access: { has: function (obj) { return "listOrders" in obj; }, get: function (obj) { return obj.listOrders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOrder_decorators, { kind: "method", name: "getOrder", static: false, private: false, access: { has: function (obj) { return "getOrder" in obj; }, get: function (obj) { return obj.getOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refund_decorators, { kind: "method", name: "refund", static: false, private: false, access: { has: function (obj) { return "refund" in obj; }, get: function (obj) { return obj.refund; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _salesReport_decorators, { kind: "method", name: "salesReport", static: false, private: false, access: { has: function (obj) { return "salesReport" in obj; }, get: function (obj) { return obj.salesReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminOrdersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminOrdersController = _classThis;
}();
exports.AdminOrdersController = AdminOrdersController;
