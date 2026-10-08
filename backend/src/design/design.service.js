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
exports.DesignService = void 0;
var common_1 = require("@nestjs/common");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var design_request_entity_1 = require("./design-request.entity");
var DesignService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DesignService = _classThis = /** @class */ (function () {
        function DesignService_1(requests, messages, references) {
            this.requests = requests;
            this.messages = messages;
            this.references = references;
            // Máximo de imágenes de referencia por solicitud.
            this.MAX_REFERENCES = 6;
        }
        // Verifica acceso a la solicitud (dueño o admin) y la devuelve.
        DesignService_1.prototype.assertAccess = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requests.findOne({ where: { id: id } })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Solicitud no encontrada');
                            }
                            if (user.role !== 'admin' && request.requesterId !== user.id) {
                                throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
                            }
                            return [2 /*return*/, request];
                    }
                });
            });
        };
        // Registra una imagen de referencia ya guardada en disco por Multer.
        DesignService_1.prototype.addReference = function (id, user, filename) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 4]);
                            return [4 /*yield*/, this.assertAccess(id, user)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            err_1 = _a.sent();
                            return [4 /*yield*/, this.safeUnlink(filename)];
                        case 3:
                            _a.sent();
                            throw err_1;
                        case 4: return [4 /*yield*/, this.references.count({ where: { requestId: id } })];
                        case 5:
                            count = _a.sent();
                            if (!(count >= this.MAX_REFERENCES)) return [3 /*break*/, 7];
                            // Borra el archivo recién subido para no dejar huérfanos.
                            return [4 /*yield*/, this.safeUnlink(filename)];
                        case 6:
                            // Borra el archivo recién subido para no dejar huérfanos.
                            _a.sent();
                            throw new common_1.BadRequestException("M\u00E1ximo ".concat(this.MAX_REFERENCES, " im\u00E1genes por solicitud"));
                        case 7: return [2 /*return*/, this.references.save(this.references.create({
                                requestId: id,
                                filename: filename,
                                url: "/uploads/".concat(filename),
                            }))];
                    }
                });
            });
        };
        DesignService_1.prototype.listReferences = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertAccess(id, user)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.references.find({ where: { requestId: id }, order: { createdAt: 'ASC' } })];
                    }
                });
            });
        };
        DesignService_1.prototype.removeReference = function (id, refId, user) {
            return __awaiter(this, void 0, void 0, function () {
                var ref;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertAccess(id, user)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.references.findOne({ where: { id: refId, requestId: id } })];
                        case 2:
                            ref = _a.sent();
                            if (!ref) {
                                throw new common_1.NotFoundException('Imagen no encontrada');
                            }
                            return [4 /*yield*/, this.references.remove(ref)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.safeUnlink(ref.filename)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DesignService_1.prototype.safeUnlink = function (filename) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, promises_1.unlink)((0, path_1.join)(process.cwd(), 'uploads', filename))];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ---- Cliente ----
        DesignService_1.prototype.createRequest = function (requesterId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    return [2 /*return*/, this.requests.save(this.requests.create({
                            requesterId: requesterId,
                            title: dto.title,
                            eventType: dto.eventType,
                            style: (_a = dto.style) !== null && _a !== void 0 ? _a : '',
                            details: dto.details,
                            budget: (_b = dto.budget) !== null && _b !== void 0 ? _b : null,
                            status: design_request_entity_1.DesignStatus.Nueva,
                        }))];
                });
            });
        };
        DesignService_1.prototype.listMine = function (requesterId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requests.find({
                            where: { requesterId: requesterId },
                            order: { createdAt: 'DESC' },
                        })];
                });
            });
        };
        // Solicitud + hilo. Verifica propiedad salvo que sea admin.
        DesignService_1.prototype.getThread = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var request, messages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requests.findOne({ where: { id: id } })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Solicitud no encontrada');
                            }
                            if (user.role !== 'admin' && request.requesterId !== user.id) {
                                throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
                            }
                            return [4 /*yield*/, this.messages.find({
                                    where: { requestId: id },
                                    order: { createdAt: 'ASC' },
                                })];
                        case 2:
                            messages = _a.sent();
                            return [2 /*return*/, { request: request, messages: messages }];
                    }
                });
            });
        };
        // Mensaje del cliente. Si pide cambios, cuenta como revisión (respeta el tope).
        DesignService_1.prototype.addClientMessage = function (id, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requests.findOne({ where: { id: id } })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Solicitud no encontrada');
                            }
                            if (request.requesterId !== userId) {
                                throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
                            }
                            if (request.status === design_request_entity_1.DesignStatus.Aprobada || request.status === design_request_entity_1.DesignStatus.Rechazada) {
                                throw new common_1.BadRequestException('La solicitud ya está cerrada');
                            }
                            if (!dto.requestChanges) return [3 /*break*/, 3];
                            if (request.revisionsUsed >= request.revisionLimit) {
                                throw new common_1.BadRequestException("Alcanzaste el l\u00EDmite de ".concat(request.revisionLimit, " revisiones"));
                            }
                            request.revisionsUsed += 1;
                            // Pedir cambios reabre el trabajo del negocio.
                            request.status = design_request_entity_1.DesignStatus.EnProceso;
                            return [4 /*yield*/, this.requests.save(request)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, this.messages.save(this.messages.create({
                                requestId: id,
                                authorId: userId,
                                authorRole: 'client',
                                body: dto.body,
                                isProposal: false,
                            }))];
                    }
                });
            });
        };
        // Devuelve la solicitud validando que el usuario sea el dueño y que esté lista
        // para pagar (estado propuesta con precio). La usa OrdersService.
        DesignService_1.prototype.getPayable = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requests.findOne({ where: { id: id } })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Solicitud no encontrada');
                            }
                            if (request.requesterId !== userId) {
                                throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
                            }
                            if (request.status !== design_request_entity_1.DesignStatus.Propuesta || !request.priceCents) {
                                throw new common_1.BadRequestException('Esta solicitud no tiene una propuesta por pagar');
                            }
                            return [2 /*return*/, request];
                    }
                });
            });
        };
        // Marca la solicitud como aprobada y pagada. La llama OrdersService cuando se
        // confirma el pago del diseño (webhook o modo simulado). Idempotente.
        DesignService_1.prototype.markApprovedPaid = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requests.findOne({ where: { id: id } })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Solicitud no encontrada');
                            }
                            request.status = design_request_entity_1.DesignStatus.Aprobada;
                            request.paid = true;
                            return [2 /*return*/, this.requests.save(request)];
                    }
                });
            });
        };
        // El cliente solicita un ajuste DESPUÉS de aprobar y pagar. Tiene costo adicional:
        // reabre la solicitud a 'ajuste_solicitado' para que el admin envíe una nueva
        // propuesta con su precio. Resetea paid (el ajuste se cobra aparte).
        DesignService_1.prototype.requestAdjustment = function (id, userId, note) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requests.findOne({ where: { id: id } })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Solicitud no encontrada');
                            }
                            if (request.requesterId !== userId) {
                                throw new common_1.ForbiddenException('No tienes acceso a esta solicitud');
                            }
                            if (request.status !== design_request_entity_1.DesignStatus.Aprobada || !request.paid) {
                                throw new common_1.BadRequestException('Solo puedes solicitar un ajuste con costo sobre un diseño aprobado y pagado');
                            }
                            request.status = design_request_entity_1.DesignStatus.AjusteSolicitado;
                            request.paid = false;
                            request.priceCents = null;
                            return [4 /*yield*/, this.requests.save(request)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.messages.save(this.messages.create({
                                    requestId: id,
                                    authorId: userId,
                                    authorRole: 'client',
                                    body: note || 'Solicito un ajuste adicional (con costo).',
                                    isProposal: false,
                                }))];
                    }
                });
            });
        };
        // ---- Admin ----
        DesignService_1.prototype.listAll = function (status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requests.find({
                            where: status ? { status: status } : {},
                            order: { createdAt: 'DESC' },
                        })];
                });
            });
        };
        DesignService_1.prototype.setStatus = function (id, status) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requests.findOne({ where: { id: id } })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Solicitud no encontrada');
                            }
                            request.status = status;
                            return [2 /*return*/, this.requests.save(request)];
                    }
                });
            });
        };
        // El admin envía una propuesta con precio: añade mensaje marcado, fija el precio
        // y pone estado 'propuesta'. El cliente deberá pagar ese precio para aprobar.
        DesignService_1.prototype.addProposal = function (id, adminId, dto, priceCents) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requests.findOne({ where: { id: id } })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Solicitud no encontrada');
                            }
                            if (!priceCents || priceCents < 100) {
                                throw new common_1.BadRequestException('La propuesta debe incluir un precio válido (mínimo $1)');
                            }
                            request.status = design_request_entity_1.DesignStatus.Propuesta;
                            request.priceCents = priceCents;
                            request.paid = false;
                            return [4 /*yield*/, this.requests.save(request)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.messages.save(this.messages.create({
                                    requestId: id,
                                    authorId: adminId,
                                    authorRole: 'admin',
                                    body: dto.body,
                                    isProposal: true,
                                }))];
                    }
                });
            });
        };
        return DesignService_1;
    }());
    __setFunctionName(_classThis, "DesignService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DesignService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DesignService = _classThis;
}();
exports.DesignService = DesignService;
