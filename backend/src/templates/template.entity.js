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
exports.TemplateDefinition = void 0;
var typeorm_1 = require("typeorm");
var template_enums_1 = require("./template.enums");
// Definición de una plantilla del catálogo.
// Separa el DISEÑO (esta entidad) del CONTENIDO del evento (otra entidad, en etapas posteriores).
var TemplateDefinition = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('templates')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _eventTypes_decorators;
    var _eventTypes_initializers = [];
    var _eventTypes_extraInitializers = [];
    var _format_decorators;
    var _format_initializers = [];
    var _format_extraInitializers = [];
    var _style_decorators;
    var _style_initializers = [];
    var _style_extraInitializers = [];
    var _previewUrl_decorators;
    var _previewUrl_initializers = [];
    var _previewUrl_extraInitializers = [];
    var _schema_decorators;
    var _schema_initializers = [];
    var _schema_extraInitializers = [];
    var _theme_decorators;
    var _theme_initializers = [];
    var _theme_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var TemplateDefinition = _classThis = /** @class */ (function () {
        function TemplateDefinition_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            // Tipos de evento para los que aplica la plantilla (una plantilla puede servir a varios).
            this.eventTypes = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _eventTypes_initializers, void 0));
            // Formato de entrega: web o imagen en el MVP.
            this.format = (__runInitializers(this, _eventTypes_extraInitializers), __runInitializers(this, _format_initializers, void 0));
            // Estilo visual, para filtrar en el catálogo.
            this.style = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _style_initializers, void 0));
            // Imagen de vista previa del catálogo (URL en object storage; en el seed es un placeholder).
            this.previewUrl = (__runInitializers(this, _style_extraInitializers), __runInitializers(this, _previewUrl_initializers, void 0));
            // Definición de los campos editables de la plantilla (estructura flexible por formato).
            this.schema = (__runInitializers(this, _previewUrl_extraInitializers), __runInitializers(this, _schema_initializers, void 0));
            // Paleta base de la plantilla, para render del ejemplo (colores, tipografías de Google Fonts).
            this.theme = (__runInitializers(this, _schema_extraInitializers), __runInitializers(this, _theme_initializers, void 0));
            // Permite publicar/retirar una plantilla sin borrarla.
            this.isActive = (__runInitializers(this, _theme_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return TemplateDefinition_1;
    }());
    __setFunctionName(_classThis, "TemplateDefinition");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _name_decorators = [(0, typeorm_1.Column)({ length: 120 })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', default: '' })];
        _eventTypes_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: template_enums_1.EventType, array: true })];
        _format_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: template_enums_1.TemplateFormat })];
        _style_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: template_enums_1.TemplateStyle })];
        _previewUrl_decorators = [(0, typeorm_1.Column)({ type: 'text', default: '' })];
        _schema_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _theme_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _isActive_decorators = [(0, typeorm_1.Column)({ default: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _eventTypes_decorators, { kind: "field", name: "eventTypes", static: false, private: false, access: { has: function (obj) { return "eventTypes" in obj; }, get: function (obj) { return obj.eventTypes; }, set: function (obj, value) { obj.eventTypes = value; } }, metadata: _metadata }, _eventTypes_initializers, _eventTypes_extraInitializers);
        __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: function (obj) { return "format" in obj; }, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
        __esDecorate(null, null, _style_decorators, { kind: "field", name: "style", static: false, private: false, access: { has: function (obj) { return "style" in obj; }, get: function (obj) { return obj.style; }, set: function (obj, value) { obj.style = value; } }, metadata: _metadata }, _style_initializers, _style_extraInitializers);
        __esDecorate(null, null, _previewUrl_decorators, { kind: "field", name: "previewUrl", static: false, private: false, access: { has: function (obj) { return "previewUrl" in obj; }, get: function (obj) { return obj.previewUrl; }, set: function (obj, value) { obj.previewUrl = value; } }, metadata: _metadata }, _previewUrl_initializers, _previewUrl_extraInitializers);
        __esDecorate(null, null, _schema_decorators, { kind: "field", name: "schema", static: false, private: false, access: { has: function (obj) { return "schema" in obj; }, get: function (obj) { return obj.schema; }, set: function (obj, value) { obj.schema = value; } }, metadata: _metadata }, _schema_initializers, _schema_extraInitializers);
        __esDecorate(null, null, _theme_decorators, { kind: "field", name: "theme", static: false, private: false, access: { has: function (obj) { return "theme" in obj; }, get: function (obj) { return obj.theme; }, set: function (obj, value) { obj.theme = value; } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TemplateDefinition = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TemplateDefinition = _classThis;
}();
exports.TemplateDefinition = TemplateDefinition;
