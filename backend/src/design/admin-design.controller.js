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
exports.AdminDesignController = void 0;
var common_1 = require("@nestjs/common");
var decorators_1 = require("../auth/decorators");
var user_entity_1 = require("../auth/user.entity");
// Bandeja de solicitudes de diseño para el admin.
var AdminDesignController = function () {
    var _classDecorators = [(0, decorators_1.Roles)(user_entity_1.UserRole.Admin), (0, common_1.Controller)('admin/design-requests')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _list_decorators;
    var _getThread_decorators;
    var _listReferences_decorators;
    var _setStatus_decorators;
    var _addProposal_decorators;
    var AdminDesignController = _classThis = /** @class */ (function () {
        function AdminDesignController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        AdminDesignController_1.prototype.list = function (status) {
            return this.service.listAll(status);
        };
        AdminDesignController_1.prototype.getThread = function (id, user) {
            return this.service.getThread(id, user);
        };
        AdminDesignController_1.prototype.listReferences = function (id, user) {
            return this.service.listReferences(id, user);
        };
        AdminDesignController_1.prototype.setStatus = function (id, status) {
            return this.service.setStatus(id, status);
        };
        // Envía propuesta con precio (en centavos de MXN).
        AdminDesignController_1.prototype.addProposal = function (id, dto, priceCents, user) {
            return this.service.addProposal(id, user.id, dto, Number(priceCents));
        };
        return AdminDesignController_1;
    }());
    __setFunctionName(_classThis, "AdminDesignController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _list_decorators = [(0, common_1.Get)()];
        _getThread_decorators = [(0, common_1.Get)(':id')];
        _listReferences_decorators = [(0, common_1.Get)(':id/references')];
        _setStatus_decorators = [(0, common_1.Patch)(':id/status')];
        _addProposal_decorators = [(0, common_1.Post)(':id/proposal')];
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getThread_decorators, { kind: "method", name: "getThread", static: false, private: false, access: { has: function (obj) { return "getThread" in obj; }, get: function (obj) { return obj.getThread; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listReferences_decorators, { kind: "method", name: "listReferences", static: false, private: false, access: { has: function (obj) { return "listReferences" in obj; }, get: function (obj) { return obj.listReferences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setStatus_decorators, { kind: "method", name: "setStatus", static: false, private: false, access: { has: function (obj) { return "setStatus" in obj; }, get: function (obj) { return obj.setStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addProposal_decorators, { kind: "method", name: "addProposal", static: false, private: false, access: { has: function (obj) { return "addProposal" in obj; }, get: function (obj) { return obj.addProposal; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDesignController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDesignController = _classThis;
}();
exports.AdminDesignController = AdminDesignController;
