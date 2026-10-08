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
exports.Invitation = exports.InvitationStatus = void 0;
var typeorm_1 = require("typeorm");
var template_entity_1 = require("../templates/template.entity");
var event_entity_1 = require("./event.entity");
// Estado de la invitación en su ciclo de vida.
// En la Etapa 2 solo se usa 'draft'; 'published' llega con el pago (Etapa 3).
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["Draft"] = "draft";
    InvitationStatus["Published"] = "published";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
// Instancia personalizada: plantilla elegida + contenido del evento + overrides de diseño.
var Invitation = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('invitations')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _template_decorators;
    var _template_initializers = [];
    var _template_extraInitializers = [];
    var _templateId_decorators;
    var _templateId_initializers = [];
    var _templateId_extraInitializers = [];
    var _ownerId_decorators;
    var _ownerId_initializers = [];
    var _ownerId_extraInitializers = [];
    var _ticketsEnabled_decorators;
    var _ticketsEnabled_initializers = [];
    var _ticketsEnabled_extraInitializers = [];
    var _event_decorators;
    var _event_initializers = [];
    var _event_extraInitializers = [];
    var _eventId_decorators;
    var _eventId_initializers = [];
    var _eventId_extraInitializers = [];
    var _customization_decorators;
    var _customization_initializers = [];
    var _customization_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _publicToken_decorators;
    var _publicToken_initializers = [];
    var _publicToken_extraInitializers = [];
    var _publishedAt_decorators;
    var _publishedAt_initializers = [];
    var _publishedAt_extraInitializers = [];
    var _expiresAt_decorators;
    var _expiresAt_initializers = [];
    var _expiresAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Invitation = _classThis = /** @class */ (function () {
        function Invitation_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // Plantilla base (diseño). No se borra la plantilla aunque se use aquí.
            this.template = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _template_initializers, void 0));
            this.templateId = (__runInitializers(this, _template_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            // Dueño de la invitación (organizador). Clave para la separación de datos entre clientes.
            this.ownerId = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            // Módulo opcional de boletos QR. Si está activo, los invitados confirmados tienen pase.
            this.ticketsEnabled = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _ticketsEnabled_initializers, void 0));
            // Contenido del evento (relación 1:1).
            this.event = (__runInitializers(this, _ticketsEnabled_extraInitializers), __runInitializers(this, _event_initializers, void 0));
            this.eventId = (__runInitializers(this, _event_extraInitializers), __runInitializers(this, _eventId_initializers, void 0));
            // Personalización del diseño sobre la plantilla: colores, tipografías, textos.
            // Parte de una copia del theme de la plantilla y el usuario la ajusta.
            this.customization = (__runInitializers(this, _eventId_extraInitializers), __runInitializers(this, _customization_initializers, void 0));
            this.status = (__runInitializers(this, _customization_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            // Token público opaco del enlace de la invitación publicada (se genera al pagar).
            // No expone el id interno. Nullable mientras es borrador.
            this.publicToken = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _publicToken_initializers, void 0));
            // Vigencia del enlace publicado (política de la Etapa 3).
            this.publishedAt = (__runInitializers(this, _publicToken_extraInitializers), __runInitializers(this, _publishedAt_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _publishedAt_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return Invitation_1;
    }());
    __setFunctionName(_classThis, "Invitation");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _template_decorators = [(0, typeorm_1.ManyToOne)(function () { return template_entity_1.TemplateDefinition; }, { eager: true, onDelete: 'RESTRICT' }), (0, typeorm_1.JoinColumn)({ name: 'template_id' })];
        _templateId_decorators = [(0, typeorm_1.Column)({ name: 'template_id' })];
        _ownerId_decorators = [(0, typeorm_1.Column)({ name: 'owner_id', type: 'uuid', nullable: true })];
        _ticketsEnabled_decorators = [(0, typeorm_1.Column)({ name: 'tickets_enabled', default: false })];
        _event_decorators = [(0, typeorm_1.OneToOne)(function () { return event_entity_1.Event; }, function (event) { return event.invitation; }, {
                cascade: true,
                eager: true,
            }), (0, typeorm_1.JoinColumn)({ name: 'event_id' })];
        _eventId_decorators = [(0, typeorm_1.Column)({ name: 'event_id' })];
        _customization_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _status_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.Draft })];
        _publicToken_decorators = [(0, typeorm_1.Column)({ name: 'public_token', type: 'varchar', length: 64, nullable: true, unique: true })];
        _publishedAt_decorators = [(0, typeorm_1.Column)({ name: 'published_at', type: 'timestamptz', nullable: true })];
        _expiresAt_decorators = [(0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamptz', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: function (obj) { return "template" in obj; }, get: function (obj) { return obj.template; }, set: function (obj, value) { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: function (obj) { return "templateId" in obj; }, get: function (obj) { return obj.templateId; }, set: function (obj, value) { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: function (obj) { return "ownerId" in obj; }, get: function (obj) { return obj.ownerId; }, set: function (obj, value) { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _ticketsEnabled_decorators, { kind: "field", name: "ticketsEnabled", static: false, private: false, access: { has: function (obj) { return "ticketsEnabled" in obj; }, get: function (obj) { return obj.ticketsEnabled; }, set: function (obj, value) { obj.ticketsEnabled = value; } }, metadata: _metadata }, _ticketsEnabled_initializers, _ticketsEnabled_extraInitializers);
        __esDecorate(null, null, _event_decorators, { kind: "field", name: "event", static: false, private: false, access: { has: function (obj) { return "event" in obj; }, get: function (obj) { return obj.event; }, set: function (obj, value) { obj.event = value; } }, metadata: _metadata }, _event_initializers, _event_extraInitializers);
        __esDecorate(null, null, _eventId_decorators, { kind: "field", name: "eventId", static: false, private: false, access: { has: function (obj) { return "eventId" in obj; }, get: function (obj) { return obj.eventId; }, set: function (obj, value) { obj.eventId = value; } }, metadata: _metadata }, _eventId_initializers, _eventId_extraInitializers);
        __esDecorate(null, null, _customization_decorators, { kind: "field", name: "customization", static: false, private: false, access: { has: function (obj) { return "customization" in obj; }, get: function (obj) { return obj.customization; }, set: function (obj, value) { obj.customization = value; } }, metadata: _metadata }, _customization_initializers, _customization_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _publicToken_decorators, { kind: "field", name: "publicToken", static: false, private: false, access: { has: function (obj) { return "publicToken" in obj; }, get: function (obj) { return obj.publicToken; }, set: function (obj, value) { obj.publicToken = value; } }, metadata: _metadata }, _publicToken_initializers, _publicToken_extraInitializers);
        __esDecorate(null, null, _publishedAt_decorators, { kind: "field", name: "publishedAt", static: false, private: false, access: { has: function (obj) { return "publishedAt" in obj; }, get: function (obj) { return obj.publishedAt; }, set: function (obj, value) { obj.publishedAt = value; } }, metadata: _metadata }, _publishedAt_initializers, _publishedAt_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: function (obj) { return "expiresAt" in obj; }, get: function (obj) { return obj.expiresAt; }, set: function (obj, value) { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Invitation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Invitation = _classThis;
}();
exports.Invitation = Invitation;
