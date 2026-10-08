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
exports.TemplatesController = void 0;
var common_1 = require("@nestjs/common");
var template_enums_1 = require("./template.enums");
var decorators_1 = require("../auth/decorators");
var user_entity_1 = require("../auth/user.entity");
var TemplatesController = function () {
    var _classDecorators = [(0, common_1.Controller)('templates')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findCatalog_decorators;
    var _getFilters_decorators;
    var _findAllForAdmin_decorators;
    var _create_decorators;
    var _setActive_decorators;
    var _findOne_decorators;
    var TemplatesController = _classThis = /** @class */ (function () {
        function TemplatesController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        // Catálogo público con filtros. GET /templates?eventType=&style=&format=
        TemplatesController_1.prototype.findCatalog = function (query) {
            return this.service.findCatalog(query);
        };
        // Opciones de filtro para que el frontend arme la UI sin hardcodear etiquetas.
        // GET /templates/filters
        TemplatesController_1.prototype.getFilters = function () {
            var toList = function (labels) {
                return Object.entries(labels).map(function (_a) {
                    var value = _a[0], label = _a[1];
                    return ({ value: value, label: label });
                });
            };
            return {
                eventTypes: toList(template_enums_1.EVENT_TYPE_LABELS),
                formats: toList(template_enums_1.TEMPLATE_FORMAT_LABELS),
                styles: toList(template_enums_1.TEMPLATE_STYLE_LABELS),
            };
        };
        // --- Administración (solo rol admin) ---
        TemplatesController_1.prototype.findAllForAdmin = function () {
            return this.service.findAllForAdmin();
        };
        TemplatesController_1.prototype.create = function (dto) {
            return this.service.create(dto);
        };
        TemplatesController_1.prototype.setActive = function (id, isActive) {
            return this.service.setActive(id, isActive);
        };
        // Detalle / vista de ejemplo (público). GET /templates/:id
        // Va al final para no capturar las rutas estáticas de admin.
        TemplatesController_1.prototype.findOne = function (id) {
            return this.service.findOne(id);
        };
        return TemplatesController_1;
    }());
    __setFunctionName(_classThis, "TemplatesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findCatalog_decorators = [(0, decorators_1.Public)(), (0, common_1.Get)()];
        _getFilters_decorators = [(0, decorators_1.Public)(), (0, common_1.Get)('filters')];
        _findAllForAdmin_decorators = [(0, decorators_1.Roles)(user_entity_1.UserRole.Admin), (0, common_1.Get)('admin/all')];
        _create_decorators = [(0, decorators_1.Roles)(user_entity_1.UserRole.Admin), (0, common_1.Post)()];
        _setActive_decorators = [(0, decorators_1.Roles)(user_entity_1.UserRole.Admin), (0, common_1.Patch)(':id/active')];
        _findOne_decorators = [(0, decorators_1.Public)(), (0, common_1.Get)(':id')];
        __esDecorate(_classThis, null, _findCatalog_decorators, { kind: "method", name: "findCatalog", static: false, private: false, access: { has: function (obj) { return "findCatalog" in obj; }, get: function (obj) { return obj.findCatalog; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFilters_decorators, { kind: "method", name: "getFilters", static: false, private: false, access: { has: function (obj) { return "getFilters" in obj; }, get: function (obj) { return obj.getFilters; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllForAdmin_decorators, { kind: "method", name: "findAllForAdmin", static: false, private: false, access: { has: function (obj) { return "findAllForAdmin" in obj; }, get: function (obj) { return obj.findAllForAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setActive_decorators, { kind: "method", name: "setActive", static: false, private: false, access: { has: function (obj) { return "setActive" in obj; }, get: function (obj) { return obj.setActive; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TemplatesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TemplatesController = _classThis;
}();
exports.TemplatesController = TemplatesController;
