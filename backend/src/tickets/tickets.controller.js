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
exports.TicketsController = void 0;
var common_1 = require("@nestjs/common");
var decorators_1 = require("../auth/decorators");
var TicketsController = function () {
    var _classDecorators = [(0, common_1.Controller)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _setEnabled_decorators;
    var _assignStaff_decorators;
    var _getPass_decorators;
    var _inspect_decorators;
    var _checkIn_decorators;
    var TicketsController = _classThis = /** @class */ (function () {
        function TicketsController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        // --- Organizador (dueño) ---
        // Activa/desactiva boletos de la invitación. PATCH /invitations/:id/tickets
        TicketsController_1.prototype.setEnabled = function (id, enabled, user) {
            return this.service.setTicketsEnabled(id, user.id, !!enabled);
        };
        // Asigna personal de acceso por correo. POST /invitations/:id/staff
        TicketsController_1.prototype.assignStaff = function (id, email, user) {
            return this.service.assignStaff(id, user.id, email !== null && email !== void 0 ? email : '');
        };
        // --- Invitado (público, por su accessToken) ---
        // Pase con QR del invitado. GET /pass/:accessToken
        TicketsController_1.prototype.getPass = function (accessToken) {
            return this.service.getGuestPass(accessToken);
        };
        // --- Personal de acceso / dueño ---
        // Consulta el estado del pase. GET /tickets/:ticketToken
        TicketsController_1.prototype.inspect = function (ticketToken, user) {
            return this.service.inspect(ticketToken, user);
        };
        // Registra la entrada. POST /tickets/:ticketToken/checkin
        TicketsController_1.prototype.checkIn = function (ticketToken, user) {
            return this.service.checkIn(ticketToken, user);
        };
        return TicketsController_1;
    }());
    __setFunctionName(_classThis, "TicketsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _setEnabled_decorators = [(0, common_1.Patch)('invitations/:id/tickets')];
        _assignStaff_decorators = [(0, common_1.Post)('invitations/:id/staff')];
        _getPass_decorators = [(0, decorators_1.Public)(), (0, common_1.Get)('pass/:accessToken')];
        _inspect_decorators = [(0, common_1.Get)('tickets/:ticketToken')];
        _checkIn_decorators = [(0, common_1.Post)('tickets/:ticketToken/checkin')];
        __esDecorate(_classThis, null, _setEnabled_decorators, { kind: "method", name: "setEnabled", static: false, private: false, access: { has: function (obj) { return "setEnabled" in obj; }, get: function (obj) { return obj.setEnabled; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignStaff_decorators, { kind: "method", name: "assignStaff", static: false, private: false, access: { has: function (obj) { return "assignStaff" in obj; }, get: function (obj) { return obj.assignStaff; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPass_decorators, { kind: "method", name: "getPass", static: false, private: false, access: { has: function (obj) { return "getPass" in obj; }, get: function (obj) { return obj.getPass; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _inspect_decorators, { kind: "method", name: "inspect", static: false, private: false, access: { has: function (obj) { return "inspect" in obj; }, get: function (obj) { return obj.inspect; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkIn_decorators, { kind: "method", name: "checkIn", static: false, private: false, access: { has: function (obj) { return "checkIn" in obj; }, get: function (obj) { return obj.checkIn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TicketsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TicketsController = _classThis;
}();
exports.TicketsController = TicketsController;
