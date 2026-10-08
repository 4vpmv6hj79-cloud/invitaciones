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
exports.DesignController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var crypto_1 = require("crypto");
var path_1 = require("path");
// Config de Multer: guarda en uploads/ con nombre aleatorio; solo imágenes; 5 MB máx.
var imageUpload = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: function (_req, file, cb) {
            var name = (0, crypto_1.randomBytes)(16).toString('hex') + (0, path_1.extname)(file.originalname).toLowerCase();
            cb(null, name);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (_req, file, cb) {
        if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new common_1.BadRequestException('Solo se permiten imágenes (jpg, png, webp, gif)'), false);
        }
    },
};
// Solicitudes de diseño del cliente (requiere sesión; guard global).
var DesignController = function () {
    var _classDecorators = [(0, common_1.Controller)('design-requests')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _listMine_decorators;
    var _getThread_decorators;
    var _addMessage_decorators;
    var _requestAdjustment_decorators;
    var _listReferences_decorators;
    var _uploadReference_decorators;
    var _removeReference_decorators;
    var DesignController = _classThis = /** @class */ (function () {
        function DesignController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        DesignController_1.prototype.create = function (dto, user) {
            return this.service.createRequest(user.id, dto);
        };
        DesignController_1.prototype.listMine = function (user) {
            return this.service.listMine(user.id);
        };
        DesignController_1.prototype.getThread = function (id, user) {
            return this.service.getThread(id, user);
        };
        DesignController_1.prototype.addMessage = function (id, dto, user) {
            return this.service.addClientMessage(id, user.id, dto);
        };
        // El cliente solicita un ajuste tras aprobar y pagar (tendrá costo adicional).
        DesignController_1.prototype.requestAdjustment = function (id, note, user) {
            return this.service.requestAdjustment(id, user.id, note !== null && note !== void 0 ? note : '');
        };
        // --- Imágenes de referencia ---
        DesignController_1.prototype.listReferences = function (id, user) {
            return this.service.listReferences(id, user);
        };
        // Sube una imagen (multipart form-data, campo 'file').
        DesignController_1.prototype.uploadReference = function (id, file, user) {
            if (!file) {
                throw new common_1.BadRequestException('No se recibió ninguna imagen');
            }
            return this.service.addReference(id, user, file.filename);
        };
        DesignController_1.prototype.removeReference = function (id, refId, user) {
            return this.service.removeReference(id, refId, user);
        };
        return DesignController_1;
    }());
    __setFunctionName(_classThis, "DesignController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _listMine_decorators = [(0, common_1.Get)()];
        _getThread_decorators = [(0, common_1.Get)(':id')];
        _addMessage_decorators = [(0, common_1.Post)(':id/messages')];
        _requestAdjustment_decorators = [(0, common_1.Post)(':id/request-adjustment')];
        _listReferences_decorators = [(0, common_1.Get)(':id/references')];
        _uploadReference_decorators = [(0, common_1.Post)(':id/references'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', imageUpload))];
        _removeReference_decorators = [(0, common_1.Delete)(':id/references/:refId')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listMine_decorators, { kind: "method", name: "listMine", static: false, private: false, access: { has: function (obj) { return "listMine" in obj; }, get: function (obj) { return obj.listMine; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getThread_decorators, { kind: "method", name: "getThread", static: false, private: false, access: { has: function (obj) { return "getThread" in obj; }, get: function (obj) { return obj.getThread; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addMessage_decorators, { kind: "method", name: "addMessage", static: false, private: false, access: { has: function (obj) { return "addMessage" in obj; }, get: function (obj) { return obj.addMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _requestAdjustment_decorators, { kind: "method", name: "requestAdjustment", static: false, private: false, access: { has: function (obj) { return "requestAdjustment" in obj; }, get: function (obj) { return obj.requestAdjustment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listReferences_decorators, { kind: "method", name: "listReferences", static: false, private: false, access: { has: function (obj) { return "listReferences" in obj; }, get: function (obj) { return obj.listReferences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadReference_decorators, { kind: "method", name: "uploadReference", static: false, private: false, access: { has: function (obj) { return "uploadReference" in obj; }, get: function (obj) { return obj.uploadReference; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeReference_decorators, { kind: "method", name: "removeReference", static: false, private: false, access: { has: function (obj) { return "removeReference" in obj; }, get: function (obj) { return obj.removeReference; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DesignController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DesignController = _classThis;
}();
exports.DesignController = DesignController;
