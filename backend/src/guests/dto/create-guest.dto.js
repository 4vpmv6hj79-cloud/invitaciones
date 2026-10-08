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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGuestDto = void 0;
var class_validator_1 = require("class-validator");
// Alta de un invitado individual (o miembro de un grupo).
var CreateGuestDto = function () {
    var _a;
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
    var _groupId_decorators;
    var _groupId_initializers = [];
    var _groupId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateGuestDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.contact = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _contact_initializers, void 0));
                this.allowedSeats = (__runInitializers(this, _contact_extraInitializers), __runInitializers(this, _allowedSeats_initializers, void 0));
                // Modo de confirmación: 'abierto' (elige cuántos) o 'cerrado' (fijo a allowedSeats).
                this.rsvpMode = (__runInitializers(this, _allowedSeats_extraInitializers), __runInitializers(this, _rsvpMode_initializers, void 0));
                this.groupId = (__runInitializers(this, _rsvpMode_extraInitializers), __runInitializers(this, _groupId_initializers, void 0));
                __runInitializers(this, _groupId_extraInitializers);
            }
            return CreateGuestDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(160)];
            _contact_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(160)];
            _allowedSeats_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(50)];
            _rsvpMode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['abierto', 'cerrado'])];
            _groupId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)('4')];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _contact_decorators, { kind: "field", name: "contact", static: false, private: false, access: { has: function (obj) { return "contact" in obj; }, get: function (obj) { return obj.contact; }, set: function (obj, value) { obj.contact = value; } }, metadata: _metadata }, _contact_initializers, _contact_extraInitializers);
            __esDecorate(null, null, _allowedSeats_decorators, { kind: "field", name: "allowedSeats", static: false, private: false, access: { has: function (obj) { return "allowedSeats" in obj; }, get: function (obj) { return obj.allowedSeats; }, set: function (obj, value) { obj.allowedSeats = value; } }, metadata: _metadata }, _allowedSeats_initializers, _allowedSeats_extraInitializers);
            __esDecorate(null, null, _rsvpMode_decorators, { kind: "field", name: "rsvpMode", static: false, private: false, access: { has: function (obj) { return "rsvpMode" in obj; }, get: function (obj) { return obj.rsvpMode; }, set: function (obj, value) { obj.rsvpMode = value; } }, metadata: _metadata }, _rsvpMode_initializers, _rsvpMode_extraInitializers);
            __esDecorate(null, null, _groupId_decorators, { kind: "field", name: "groupId", static: false, private: false, access: { has: function (obj) { return "groupId" in obj; }, get: function (obj) { return obj.groupId; }, set: function (obj, value) { obj.groupId = value; } }, metadata: _metadata }, _groupId_initializers, _groupId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateGuestDto = CreateGuestDto;
