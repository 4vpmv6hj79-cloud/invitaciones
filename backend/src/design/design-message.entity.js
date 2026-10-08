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
exports.DesignMessage = void 0;
var typeorm_1 = require("typeorm");
var design_request_entity_1 = require("./design-request.entity");
// Mensaje dentro del hilo de una solicitud de diseño.
// isProposal distingue una propuesta del negocio de un comentario normal.
var DesignMessage = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('design_messages')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _request_decorators;
    var _request_initializers = [];
    var _request_extraInitializers = [];
    var _requestId_decorators;
    var _requestId_initializers = [];
    var _requestId_extraInitializers = [];
    var _authorId_decorators;
    var _authorId_initializers = [];
    var _authorId_extraInitializers = [];
    var _authorRole_decorators;
    var _authorRole_initializers = [];
    var _authorRole_extraInitializers = [];
    var _body_decorators;
    var _body_initializers = [];
    var _body_extraInitializers = [];
    var _isProposal_decorators;
    var _isProposal_initializers = [];
    var _isProposal_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var DesignMessage = _classThis = /** @class */ (function () {
        function DesignMessage_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.request = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _request_initializers, void 0));
            this.requestId = (__runInitializers(this, _request_extraInitializers), __runInitializers(this, _requestId_initializers, void 0));
            this.authorId = (__runInitializers(this, _requestId_extraInitializers), __runInitializers(this, _authorId_initializers, void 0));
            // Rol de quien escribe: 'client' o 'admin'. Para pintar el hilo.
            this.authorRole = (__runInitializers(this, _authorId_extraInitializers), __runInitializers(this, _authorRole_initializers, void 0));
            this.body = (__runInitializers(this, _authorRole_extraInitializers), __runInitializers(this, _body_initializers, void 0));
            // true = propuesta del negocio (admin); false = comentario.
            this.isProposal = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _isProposal_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isProposal_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return DesignMessage_1;
    }());
    __setFunctionName(_classThis, "DesignMessage");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _request_decorators = [(0, typeorm_1.ManyToOne)(function () { return design_request_entity_1.DesignRequest; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'request_id' })];
        _requestId_decorators = [(0, typeorm_1.Column)({ name: 'request_id', type: 'uuid' })];
        _authorId_decorators = [(0, typeorm_1.Column)({ name: 'author_id', type: 'uuid' })];
        _authorRole_decorators = [(0, typeorm_1.Column)({ name: 'author_role', length: 20 })];
        _body_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _isProposal_decorators = [(0, typeorm_1.Column)({ name: 'is_proposal', default: false })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _request_decorators, { kind: "field", name: "request", static: false, private: false, access: { has: function (obj) { return "request" in obj; }, get: function (obj) { return obj.request; }, set: function (obj, value) { obj.request = value; } }, metadata: _metadata }, _request_initializers, _request_extraInitializers);
        __esDecorate(null, null, _requestId_decorators, { kind: "field", name: "requestId", static: false, private: false, access: { has: function (obj) { return "requestId" in obj; }, get: function (obj) { return obj.requestId; }, set: function (obj, value) { obj.requestId = value; } }, metadata: _metadata }, _requestId_initializers, _requestId_extraInitializers);
        __esDecorate(null, null, _authorId_decorators, { kind: "field", name: "authorId", static: false, private: false, access: { has: function (obj) { return "authorId" in obj; }, get: function (obj) { return obj.authorId; }, set: function (obj, value) { obj.authorId = value; } }, metadata: _metadata }, _authorId_initializers, _authorId_extraInitializers);
        __esDecorate(null, null, _authorRole_decorators, { kind: "field", name: "authorRole", static: false, private: false, access: { has: function (obj) { return "authorRole" in obj; }, get: function (obj) { return obj.authorRole; }, set: function (obj, value) { obj.authorRole = value; } }, metadata: _metadata }, _authorRole_initializers, _authorRole_extraInitializers);
        __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: function (obj) { return "body" in obj; }, get: function (obj) { return obj.body; }, set: function (obj, value) { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
        __esDecorate(null, null, _isProposal_decorators, { kind: "field", name: "isProposal", static: false, private: false, access: { has: function (obj) { return "isProposal" in obj; }, get: function (obj) { return obj.isProposal; }, set: function (obj, value) { obj.isProposal = value; } }, metadata: _metadata }, _isProposal_initializers, _isProposal_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DesignMessage = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DesignMessage = _classThis;
}();
exports.DesignMessage = DesignMessage;
