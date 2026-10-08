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
exports.Guest = exports.GuestRsvpMode = exports.RsvpStatus = void 0;
var typeorm_1 = require("typeorm");
var invitation_entity_1 = require("../invitations/invitation.entity");
var guest_group_entity_1 = require("./guest-group.entity");
// Estado de confirmación de asistencia del invitado.
var RsvpStatus;
(function (RsvpStatus) {
    RsvpStatus["Pending"] = "pending";
    RsvpStatus["Confirmed"] = "confirmed";
    RsvpStatus["Declined"] = "declined";
})(RsvpStatus || (exports.RsvpStatus = RsvpStatus = {}));
// Modo de confirmación por invitado:
// - Abierto: el invitado elige cuántos asisten (hasta allowedSeats).
// - Cerrado: confirma exactamente allowedSeats (solo acepta o declina).
var GuestRsvpMode;
(function (GuestRsvpMode) {
    GuestRsvpMode["Abierto"] = "abierto";
    GuestRsvpMode["Cerrado"] = "cerrado";
})(GuestRsvpMode || (exports.GuestRsvpMode = GuestRsvpMode = {}));
// Datos privados de un invitado. Nunca se exponen públicamente ni a otros invitados.
var Guest = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('guests')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _invitation_decorators;
    var _invitation_initializers = [];
    var _invitation_extraInitializers = [];
    var _invitationId_decorators;
    var _invitationId_initializers = [];
    var _invitationId_extraInitializers = [];
    var _group_decorators;
    var _group_initializers = [];
    var _group_extraInitializers = [];
    var _groupId_decorators;
    var _groupId_initializers = [];
    var _groupId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _contact_decorators;
    var _contact_initializers = [];
    var _contact_extraInitializers = [];
    var _allowedSeats_decorators;
    var _allowedSeats_initializers = [];
    var _allowedSeats_extraInitializers = [];
    var _rsvpMode_decorators;
    var _rsvpMode_initializers = [];
    var _rsvpMode_extraInitializers = [];
    var _rsvpStatus_decorators;
    var _rsvpStatus_initializers = [];
    var _rsvpStatus_extraInitializers = [];
    var _confirmedSeats_decorators;
    var _confirmedSeats_initializers = [];
    var _confirmedSeats_extraInitializers = [];
    var _dietaryNotes_decorators;
    var _dietaryNotes_initializers = [];
    var _dietaryNotes_extraInitializers = [];
    var _accessToken_decorators;
    var _accessToken_initializers = [];
    var _accessToken_extraInitializers = [];
    var _ticketToken_decorators;
    var _ticketToken_initializers = [];
    var _ticketToken_extraInitializers = [];
    var _checkedInAt_decorators;
    var _checkedInAt_initializers = [];
    var _checkedInAt_extraInitializers = [];
    var _respondedAt_decorators;
    var _respondedAt_initializers = [];
    var _respondedAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Guest = _classThis = /** @class */ (function () {
        function Guest_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.invitation = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _invitation_initializers, void 0));
            this.invitationId = (__runInitializers(this, _invitation_extraInitializers), __runInitializers(this, _invitationId_initializers, void 0));
            // Grupo opcional (familia). Si no tiene, es un invitado individual.
            this.group = (__runInitializers(this, _invitationId_extraInitializers), __runInitializers(this, _group_initializers, void 0));
            this.groupId = (__runInitializers(this, _group_extraInitializers), __runInitializers(this, _groupId_initializers, void 0));
            this.name = (__runInitializers(this, _groupId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            // Contacto opcional (correo o teléfono). Dato personal: se maneja con cuidado.
            this.contact = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _contact_initializers, void 0));
            // Lugares autorizados para este invitado (incluye acompañantes).
            this.allowedSeats = (__runInitializers(this, _contact_extraInitializers), __runInitializers(this, _allowedSeats_initializers, void 0));
            // Modo de confirmación de este invitado (abierto: elige; cerrado: fijo a allowedSeats).
            this.rsvpMode = (__runInitializers(this, _allowedSeats_extraInitializers), __runInitializers(this, _rsvpMode_initializers, void 0));
            this.rsvpStatus = (__runInitializers(this, _rsvpMode_extraInitializers), __runInitializers(this, _rsvpStatus_initializers, void 0));
            // Lugares efectivamente confirmados (0 si declina).
            this.confirmedSeats = (__runInitializers(this, _rsvpStatus_extraInitializers), __runInitializers(this, _confirmedSeats_initializers, void 0));
            // Preferencias de alimentos / necesidades especiales (opcional).
            this.dietaryNotes = (__runInitializers(this, _confirmedSeats_extraInitializers), __runInitializers(this, _dietaryNotes_initializers, void 0));
            // Token opaco para el enlace privado del invitado (confirmar sin cuenta).
            this.accessToken = (__runInitializers(this, _dietaryNotes_extraInitializers), __runInitializers(this, _accessToken_initializers, void 0));
            // Token único del pase/boleto (QR). Se genera al activar boletos.
            this.ticketToken = (__runInitializers(this, _accessToken_extraInitializers), __runInitializers(this, _ticketToken_initializers, void 0));
            // Momento del registro de entrada. Nulo = aún no ha ingresado. Previene reutilización.
            this.checkedInAt = (__runInitializers(this, _ticketToken_extraInitializers), __runInitializers(this, _checkedInAt_initializers, void 0));
            this.respondedAt = (__runInitializers(this, _checkedInAt_extraInitializers), __runInitializers(this, _respondedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _respondedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return Guest_1;
    }());
    __setFunctionName(_classThis, "Guest");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _invitation_decorators = [(0, typeorm_1.ManyToOne)(function () { return invitation_entity_1.Invitation; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'invitation_id' })];
        _invitationId_decorators = [(0, typeorm_1.Column)({ name: 'invitation_id' })];
        _group_decorators = [(0, typeorm_1.ManyToOne)(function () { return guest_group_entity_1.GuestGroup; }, { nullable: true, onDelete: 'SET NULL' }), (0, typeorm_1.JoinColumn)({ name: 'group_id' })];
        _groupId_decorators = [(0, typeorm_1.Column)({ name: 'group_id', nullable: true })];
        _name_decorators = [(0, typeorm_1.Column)({ length: 160 })];
        _contact_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 160, nullable: true })];
        _allowedSeats_decorators = [(0, typeorm_1.Column)({ name: 'allowed_seats', type: 'int', default: 1 })];
        _rsvpMode_decorators = [(0, typeorm_1.Column)({ name: 'rsvp_mode', type: 'enum', enum: GuestRsvpMode, default: GuestRsvpMode.Abierto })];
        _rsvpStatus_decorators = [(0, typeorm_1.Column)({ name: 'rsvp_status', type: 'enum', enum: RsvpStatus, default: RsvpStatus.Pending })];
        _confirmedSeats_decorators = [(0, typeorm_1.Column)({ name: 'confirmed_seats', type: 'int', default: 0 })];
        _dietaryNotes_decorators = [(0, typeorm_1.Column)({ name: 'dietary_notes', type: 'text', nullable: true })];
        _accessToken_decorators = [(0, typeorm_1.Column)({ name: 'access_token', type: 'varchar', length: 48, unique: true })];
        _ticketToken_decorators = [(0, typeorm_1.Column)({ name: 'ticket_token', type: 'varchar', length: 48, nullable: true, unique: true })];
        _checkedInAt_decorators = [(0, typeorm_1.Column)({ name: 'checked_in_at', type: 'timestamptz', nullable: true })];
        _respondedAt_decorators = [(0, typeorm_1.Column)({ name: 'responded_at', type: 'timestamptz', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _invitation_decorators, { kind: "field", name: "invitation", static: false, private: false, access: { has: function (obj) { return "invitation" in obj; }, get: function (obj) { return obj.invitation; }, set: function (obj, value) { obj.invitation = value; } }, metadata: _metadata }, _invitation_initializers, _invitation_extraInitializers);
        __esDecorate(null, null, _invitationId_decorators, { kind: "field", name: "invitationId", static: false, private: false, access: { has: function (obj) { return "invitationId" in obj; }, get: function (obj) { return obj.invitationId; }, set: function (obj, value) { obj.invitationId = value; } }, metadata: _metadata }, _invitationId_initializers, _invitationId_extraInitializers);
        __esDecorate(null, null, _group_decorators, { kind: "field", name: "group", static: false, private: false, access: { has: function (obj) { return "group" in obj; }, get: function (obj) { return obj.group; }, set: function (obj, value) { obj.group = value; } }, metadata: _metadata }, _group_initializers, _group_extraInitializers);
        __esDecorate(null, null, _groupId_decorators, { kind: "field", name: "groupId", static: false, private: false, access: { has: function (obj) { return "groupId" in obj; }, get: function (obj) { return obj.groupId; }, set: function (obj, value) { obj.groupId = value; } }, metadata: _metadata }, _groupId_initializers, _groupId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _contact_decorators, { kind: "field", name: "contact", static: false, private: false, access: { has: function (obj) { return "contact" in obj; }, get: function (obj) { return obj.contact; }, set: function (obj, value) { obj.contact = value; } }, metadata: _metadata }, _contact_initializers, _contact_extraInitializers);
        __esDecorate(null, null, _allowedSeats_decorators, { kind: "field", name: "allowedSeats", static: false, private: false, access: { has: function (obj) { return "allowedSeats" in obj; }, get: function (obj) { return obj.allowedSeats; }, set: function (obj, value) { obj.allowedSeats = value; } }, metadata: _metadata }, _allowedSeats_initializers, _allowedSeats_extraInitializers);
        __esDecorate(null, null, _rsvpMode_decorators, { kind: "field", name: "rsvpMode", static: false, private: false, access: { has: function (obj) { return "rsvpMode" in obj; }, get: function (obj) { return obj.rsvpMode; }, set: function (obj, value) { obj.rsvpMode = value; } }, metadata: _metadata }, _rsvpMode_initializers, _rsvpMode_extraInitializers);
        __esDecorate(null, null, _rsvpStatus_decorators, { kind: "field", name: "rsvpStatus", static: false, private: false, access: { has: function (obj) { return "rsvpStatus" in obj; }, get: function (obj) { return obj.rsvpStatus; }, set: function (obj, value) { obj.rsvpStatus = value; } }, metadata: _metadata }, _rsvpStatus_initializers, _rsvpStatus_extraInitializers);
        __esDecorate(null, null, _confirmedSeats_decorators, { kind: "field", name: "confirmedSeats", static: false, private: false, access: { has: function (obj) { return "confirmedSeats" in obj; }, get: function (obj) { return obj.confirmedSeats; }, set: function (obj, value) { obj.confirmedSeats = value; } }, metadata: _metadata }, _confirmedSeats_initializers, _confirmedSeats_extraInitializers);
        __esDecorate(null, null, _dietaryNotes_decorators, { kind: "field", name: "dietaryNotes", static: false, private: false, access: { has: function (obj) { return "dietaryNotes" in obj; }, get: function (obj) { return obj.dietaryNotes; }, set: function (obj, value) { obj.dietaryNotes = value; } }, metadata: _metadata }, _dietaryNotes_initializers, _dietaryNotes_extraInitializers);
        __esDecorate(null, null, _accessToken_decorators, { kind: "field", name: "accessToken", static: false, private: false, access: { has: function (obj) { return "accessToken" in obj; }, get: function (obj) { return obj.accessToken; }, set: function (obj, value) { obj.accessToken = value; } }, metadata: _metadata }, _accessToken_initializers, _accessToken_extraInitializers);
        __esDecorate(null, null, _ticketToken_decorators, { kind: "field", name: "ticketToken", static: false, private: false, access: { has: function (obj) { return "ticketToken" in obj; }, get: function (obj) { return obj.ticketToken; }, set: function (obj, value) { obj.ticketToken = value; } }, metadata: _metadata }, _ticketToken_initializers, _ticketToken_extraInitializers);
        __esDecorate(null, null, _checkedInAt_decorators, { kind: "field", name: "checkedInAt", static: false, private: false, access: { has: function (obj) { return "checkedInAt" in obj; }, get: function (obj) { return obj.checkedInAt; }, set: function (obj, value) { obj.checkedInAt = value; } }, metadata: _metadata }, _checkedInAt_initializers, _checkedInAt_extraInitializers);
        __esDecorate(null, null, _respondedAt_decorators, { kind: "field", name: "respondedAt", static: false, private: false, access: { has: function (obj) { return "respondedAt" in obj; }, get: function (obj) { return obj.respondedAt; }, set: function (obj, value) { obj.respondedAt = value; } }, metadata: _metadata }, _respondedAt_initializers, _respondedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Guest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Guest = _classThis;
}();
exports.Guest = Guest;
