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
exports.GuestGroup = void 0;
var typeorm_1 = require("typeorm");
var invitation_entity_1 = require("../invitations/invitation.entity");
// Grupo o familia de invitados, con un cupo de lugares compartido.
var GuestGroup = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('guest_groups')];
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
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _allowedSeats_decorators;
    var _allowedSeats_initializers = [];
    var _allowedSeats_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var GuestGroup = _classThis = /** @class */ (function () {
        function GuestGroup_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.invitation = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _invitation_initializers, void 0));
            this.invitationId = (__runInitializers(this, _invitation_extraInitializers), __runInitializers(this, _invitationId_initializers, void 0));
            this.name = (__runInitializers(this, _invitationId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.allowedSeats = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _allowedSeats_initializers, void 0));
            this.createdAt = (__runInitializers(this, _allowedSeats_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return GuestGroup_1;
    }());
    __setFunctionName(_classThis, "GuestGroup");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _invitation_decorators = [(0, typeorm_1.ManyToOne)(function () { return invitation_entity_1.Invitation; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'invitation_id' })];
        _invitationId_decorators = [(0, typeorm_1.Column)({ name: 'invitation_id' })];
        _name_decorators = [(0, typeorm_1.Column)({ length: 160 })];
        _allowedSeats_decorators = [(0, typeorm_1.Column)({ name: 'allowed_seats', type: 'int', default: 1 })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _invitation_decorators, { kind: "field", name: "invitation", static: false, private: false, access: { has: function (obj) { return "invitation" in obj; }, get: function (obj) { return obj.invitation; }, set: function (obj, value) { obj.invitation = value; } }, metadata: _metadata }, _invitation_initializers, _invitation_extraInitializers);
        __esDecorate(null, null, _invitationId_decorators, { kind: "field", name: "invitationId", static: false, private: false, access: { has: function (obj) { return "invitationId" in obj; }, get: function (obj) { return obj.invitationId; }, set: function (obj, value) { obj.invitationId = value; } }, metadata: _metadata }, _invitationId_initializers, _invitationId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _allowedSeats_decorators, { kind: "field", name: "allowedSeats", static: false, private: false, access: { has: function (obj) { return "allowedSeats" in obj; }, get: function (obj) { return obj.allowedSeats; }, set: function (obj, value) { obj.allowedSeats = value; } }, metadata: _metadata }, _allowedSeats_initializers, _allowedSeats_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GuestGroup = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GuestGroup = _classThis;
}();
exports.GuestGroup = GuestGroup;
