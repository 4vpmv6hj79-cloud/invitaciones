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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsController = void 0;
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
// Todas estas rutas requieren un organizador autenticado (guard global).
var InvitationsController = function () {
    var _classDecorators = [(0, common_1.Controller)('invitations')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _listMine_decorators;
    var _findOne_decorators;
    var _downloadPdf_decorators;
    var _update_decorators;
    var _uploadImage_decorators;
    var InvitationsController = _classThis = /** @class */ (function () {
        function InvitationsController_1(service, pdf) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
            this.pdf = pdf;
        }
        // Crea un borrador desde una plantilla, propiedad del usuario actual.
        InvitationsController_1.prototype.create = function (dto, user) {
            return this.service.createDraft(dto, user.id);
        };
        // Lista las invitaciones del usuario actual.
        InvitationsController_1.prototype.listMine = function (user) {
            return this.service.listByOwner(user.id);
        };
        // Lee el borrador (solo el dueño). GET /invitations/:id
        InvitationsController_1.prototype.findOne = function (id, user) {
            return this.service.findOwned(id, user.id);
        };
        // Descarga el PDF imprimible (solo el dueño). GET /invitations/:id/pdf?size=A5|A6|LETTER
        InvitationsController_1.prototype.downloadPdf = function (id, user, res, size) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation, resolved, buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.service.findOwned(id, user.id)];
                        case 1:
                            invitation = _a.sent();
                            resolved = this.pdf.resolveSize(size);
                            return [4 /*yield*/, this.pdf.buildInvitationPdf(invitation, resolved)];
                        case 2:
                            buffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': "attachment; filename=\"invitacion-".concat(resolved, ".pdf\""),
                            });
                            res.send(buffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Guarda el borrador (solo el dueño). PATCH /invitations/:id
        InvitationsController_1.prototype.update = function (id, dto, user) {
            return this.service.update(id, dto, user.id);
        };
        // Sube una imagen (portada o galería) y devuelve su URL pública.
        // multipart form-data, campo 'file'. Solo el dueño de la invitación.
        InvitationsController_1.prototype.uploadImage = function (id, file, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!file) {
                                throw new common_1.BadRequestException('No se recibió ninguna imagen');
                            }
                            // Verifica que el usuario sea dueño de la invitación antes de aceptar la imagen.
                            return [4 /*yield*/, this.service.findOwned(id, user.id)];
                        case 1:
                            // Verifica que el usuario sea dueño de la invitación antes de aceptar la imagen.
                            _a.sent();
                            return [2 /*return*/, { url: "/uploads/".concat(file.filename) }];
                    }
                });
            });
        };
        return InvitationsController_1;
    }());
    __setFunctionName(_classThis, "InvitationsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _listMine_decorators = [(0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _downloadPdf_decorators = [(0, common_1.Get)(':id/pdf')];
        _update_decorators = [(0, common_1.Patch)(':id')];
        _uploadImage_decorators = [(0, common_1.Post)(':id/upload-image'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', imageUpload))];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listMine_decorators, { kind: "method", name: "listMine", static: false, private: false, access: { has: function (obj) { return "listMine" in obj; }, get: function (obj) { return obj.listMine; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadPdf_decorators, { kind: "method", name: "downloadPdf", static: false, private: false, access: { has: function (obj) { return "downloadPdf" in obj; }, get: function (obj) { return obj.downloadPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadImage_decorators, { kind: "method", name: "uploadImage", static: false, private: false, access: { has: function (obj) { return "uploadImage" in obj; }, get: function (obj) { return obj.uploadImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InvitationsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InvitationsController = _classThis;
}();
exports.InvitationsController = InvitationsController;
