"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.InvitationsService = void 0;
var common_1 = require("@nestjs/common");
var crypto_1 = require("crypto");
var sharp_1 = require("sharp");
var invitation_entity_1 = require("./invitation.entity");
var InvitationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InvitationsService = _classThis = /** @class */ (function () {
        function InvitationsService_1(invitations, events, templates) {
            this.invitations = invitations;
            this.events = events;
            this.templates = templates;
        }
        // Crea una invitación-borrador a partir de una plantilla.
        // Copia el theme de la plantilla como punto de partida de la personalización.
        // ownerId es el organizador autenticado dueño de la invitación.
        InvitationsService_1.prototype.createDraft = function (dto, ownerId) {
            return __awaiter(this, void 0, void 0, function () {
                var template, event, invitation;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.templates.findOne({ where: { id: dto.templateId } })];
                        case 1:
                            template = _b.sent();
                            if (!template) {
                                throw new common_1.NotFoundException('Plantilla no encontrada');
                            }
                            event = this.events.create({
                                type: template.eventTypes[0],
                                title: (_a = dto.title) !== null && _a !== void 0 ? _a : '',
                                data: {},
                            });
                            invitation = this.invitations.create({
                                templateId: template.id,
                                ownerId: ownerId,
                                event: event,
                                // La personalización arranca como copia del theme de la plantilla.
                                customization: __assign({}, template.theme),
                            });
                            return [2 /*return*/, this.invitations.save(invitation)];
                    }
                });
            });
        };
        InvitationsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.invitations.findOne({ where: { id: id } })];
                        case 1:
                            invitation = _a.sent();
                            if (!invitation) {
                                throw new common_1.NotFoundException('Invitación no encontrada');
                            }
                            return [2 /*return*/, invitation];
                    }
                });
            });
        };
        // Igual que findOne pero verifica que el usuario sea el dueño (separación de datos).
        InvitationsService_1.prototype.findOwned = function (id, ownerId) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            invitation = _a.sent();
                            if (invitation.ownerId && invitation.ownerId !== ownerId) {
                                throw new common_1.ForbiddenException('No tienes acceso a esta invitación');
                            }
                            return [2 /*return*/, invitation];
                    }
                });
            });
        };
        // Lista las invitaciones del organizador (dashboard "mis invitaciones").
        InvitationsService_1.prototype.listByOwner = function (ownerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.invitations.find({
                            where: { ownerId: ownerId },
                            order: { createdAt: 'DESC' },
                        })];
                });
            });
        };
        // Guarda el borrador: título y contenido del evento + personalización del diseño.
        // Verifica propiedad antes de modificar.
        InvitationsService_1.prototype.update = function (id, dto, ownerId) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOwned(id, ownerId)];
                        case 1:
                            invitation = _a.sent();
                            if (dto.title !== undefined) {
                                invitation.event.title = dto.title;
                            }
                            if (dto.eventData) {
                                // Mezcla con el contenido existente para no perder campos no enviados.
                                invitation.event.data = __assign(__assign({}, invitation.event.data), dto.eventData);
                            }
                            if (dto.customization) {
                                invitation.customization = __assign(__assign({}, invitation.customization), dto.customization);
                            }
                            // event tiene cascade: se guarda junto con la invitación.
                            return [4 /*yield*/, this.events.save(invitation.event)];
                        case 2:
                            // event tiene cascade: se guarda junto con la invitación.
                            _a.sent();
                            return [2 /*return*/, this.invitations.save(invitation)];
                    }
                });
            });
        };
        // Publica la invitación: genera enlace público y vigencia. Idempotente:
        // si ya está publicada, conserva el token existente.
        InvitationsService_1.prototype.publish = function (id, validityDays) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation, expires;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            invitation = _a.sent();
                            if (!(invitation.status !== invitation_entity_1.InvitationStatus.Published)) return [3 /*break*/, 3];
                            invitation.status = invitation_entity_1.InvitationStatus.Published;
                            invitation.publicToken = (0, crypto_1.randomBytes)(24).toString('hex');
                            invitation.publishedAt = new Date();
                            expires = new Date();
                            expires.setDate(expires.getDate() + validityDays);
                            invitation.expiresAt = expires;
                            return [4 /*yield*/, this.invitations.save(invitation)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, invitation];
                    }
                });
            });
        };
        // Busca la invitación publicada por token (uso interno: imagen y metadatos).
        InvitationsService_1.prototype.getPublishedByToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.invitations.findOne({
                                where: { publicToken: token, status: invitation_entity_1.InvitationStatus.Published },
                            })];
                        case 1:
                            invitation = _a.sent();
                            if (!invitation) {
                                throw new common_1.NotFoundException('Invitación no encontrada');
                            }
                            return [2 /*return*/, invitation];
                    }
                });
            });
        };
        // Genera una imagen SVG para compartir, con los datos de la invitación.
        // Usa solo formas y tipografías del sistema (sin recursos con licencia de pago).
        InvitationsService_1.prototype.buildShareSvg = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var inv, c, d, bg, primary, secondary, title, names, when, where;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getPublishedByToken(token)];
                        case 1:
                            inv = _a.sent();
                            c = inv.customization;
                            d = inv.event.data;
                            bg = c.background || '#faf7ef';
                            primary = c.primary || '#b8860b';
                            secondary = c.secondary || '#7a5c13';
                            title = this.escapeXml(inv.event.title || 'Invitación');
                            names = this.escapeXml(d.coupleOrHonoree || '');
                            when = this.escapeXml([d.date, d.time ? "".concat(d.time, " h") : ''].filter(Boolean).join(' · '));
                            where = this.escapeXml(d.locationName || '');
                            // 1200x630: proporción recomendada para vistas previas en redes.
                            return [2 /*return*/, "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"630\" viewBox=\"0 0 1200 630\">\n  <rect width=\"1200\" height=\"630\" fill=\"".concat(bg, "\"/>\n  <rect x=\"40\" y=\"40\" width=\"1120\" height=\"550\" fill=\"none\" stroke=\"").concat(primary, "\" stroke-width=\"3\" rx=\"16\"/>\n  <text x=\"600\" y=\"200\" text-anchor=\"middle\" font-family=\"Georgia, serif\" font-size=\"30\" fill=\"").concat(secondary, "\" letter-spacing=\"4\">TE INVITAMOS A</text>\n  <text x=\"600\" y=\"300\" text-anchor=\"middle\" font-family=\"Georgia, serif\" font-size=\"64\" font-weight=\"bold\" fill=\"").concat(primary, "\">").concat(title, "</text>\n  ").concat(names ? "<text x=\"600\" y=\"370\" text-anchor=\"middle\" font-family=\"Georgia, serif\" font-size=\"36\" fill=\"".concat(secondary, "\">").concat(names, "</text>") : '', "\n  <line x1=\"520\" y1=\"410\" x2=\"680\" y2=\"410\" stroke=\"").concat(primary, "\" stroke-width=\"2\"/>\n  ").concat(when ? "<text x=\"600\" y=\"470\" text-anchor=\"middle\" font-family=\"Georgia, serif\" font-size=\"30\" fill=\"".concat(secondary, "\">").concat(when, "</text>") : '', "\n  ").concat(where ? "<text x=\"600\" y=\"520\" text-anchor=\"middle\" font-family=\"Georgia, serif\" font-size=\"26\" fill=\"".concat(secondary, "\">").concat(where, "</text>") : '', "\n</svg>")];
                    }
                });
            });
        };
        // Rasteriza el SVG de compartir a PNG (1200x630) para vistas previas en redes.
        InvitationsService_1.prototype.buildSharePng = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var svg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.buildShareSvg(token)];
                        case 1:
                            svg = _a.sent();
                            return [2 /*return*/, (0, sharp_1.default)(Buffer.from(svg)).png().toBuffer()];
                    }
                });
            });
        };
        InvitationsService_1.prototype.escapeXml = function (value) {
            return value
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };
        // Datos públicos de la invitación publicada, por token.
        // No expone ids internos, pedidos ni (futura) lista de invitados.
        InvitationsService_1.prototype.findPublicByToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation, expired;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.invitations.findOne({
                                where: { publicToken: token, status: invitation_entity_1.InvitationStatus.Published },
                            })];
                        case 1:
                            invitation = _a.sent();
                            if (!invitation) {
                                throw new common_1.NotFoundException('Invitación no encontrada');
                            }
                            expired = invitation.expiresAt ? invitation.expiresAt < new Date() : false;
                            return [2 /*return*/, {
                                    title: invitation.event.title,
                                    eventType: invitation.event.type,
                                    data: invitation.event.data,
                                    customization: invitation.customization,
                                    expired: expired,
                                }];
                    }
                });
            });
        };
        return InvitationsService_1;
    }());
    __setFunctionName(_classThis, "InvitationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InvitationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InvitationsService = _classThis;
}();
exports.InvitationsService = InvitationsService;
