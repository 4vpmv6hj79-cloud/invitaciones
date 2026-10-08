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
exports.TicketsService = void 0;
var common_1 = require("@nestjs/common");
var crypto_1 = require("crypto");
var QRCode = require("qrcode");
var guest_entity_1 = require("../guests/guest.entity");
var user_entity_1 = require("../auth/user.entity");
var TicketsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TicketsService = _classThis = /** @class */ (function () {
        function TicketsService_1(guests, invitations, assignments, users, config) {
            this.guests = guests;
            this.invitations = invitations;
            this.assignments = assignments;
            this.users = users;
            this.config = config;
        }
        // Verifica que el usuario sea dueño del evento.
        TicketsService_1.prototype.assertOwner = function (invitationId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.invitations.findOne({ where: { id: invitationId } })];
                        case 1:
                            invitation = _a.sent();
                            if (!invitation) {
                                throw new common_1.NotFoundException('Invitación no encontrada');
                            }
                            if (invitation.ownerId && invitation.ownerId !== userId) {
                                throw new common_1.ForbiddenException('No tienes acceso a esta invitación');
                            }
                            return [2 /*return*/, invitation];
                    }
                });
            });
        };
        // Autoriza a validar: dueño del evento o staff asignado a él.
        TicketsService_1.prototype.assertCanValidate = function (invitationId, user) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation, assigned;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.invitations.findOne({ where: { id: invitationId } })];
                        case 1:
                            invitation = _a.sent();
                            if (!invitation) {
                                throw new common_1.NotFoundException('Invitación no encontrada');
                            }
                            if (invitation.ownerId === user.id) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.assignments.findOne({
                                    where: { invitationId: invitationId, userId: user.id },
                                })];
                        case 2:
                            assigned = _a.sent();
                            if (!assigned) {
                                throw new common_1.ForbiddenException('No estás autorizado para validar en este evento');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Activa o desactiva el módulo de boletos. Al activar, emite ticketToken a los
        // invitados confirmados que aún no lo tengan.
        TicketsService_1.prototype.setTicketsEnabled = function (invitationId, userId, enabled) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation, issued, confirmed, _i, confirmed_1, g;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertOwner(invitationId, userId)];
                        case 1:
                            invitation = _a.sent();
                            invitation.ticketsEnabled = enabled;
                            return [4 /*yield*/, this.invitations.save(invitation)];
                        case 2:
                            _a.sent();
                            issued = 0;
                            if (!enabled) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.guests.find({
                                    where: { invitationId: invitationId, rsvpStatus: guest_entity_1.RsvpStatus.Confirmed },
                                })];
                        case 3:
                            confirmed = _a.sent();
                            _i = 0, confirmed_1 = confirmed;
                            _a.label = 4;
                        case 4:
                            if (!(_i < confirmed_1.length)) return [3 /*break*/, 7];
                            g = confirmed_1[_i];
                            if (!!g.ticketToken) return [3 /*break*/, 6];
                            g.ticketToken = (0, crypto_1.randomBytes)(18).toString('hex');
                            return [4 /*yield*/, this.guests.save(g)];
                        case 5:
                            _a.sent();
                            issued += 1;
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [2 /*return*/, { ticketsEnabled: enabled, issued: issued }];
                    }
                });
            });
        };
        // Pase del invitado: datos + imagen QR (data URL) que apunta al enlace de validación.
        // Si los boletos no están activos o el invitado no confirmó, no hay pase.
        TicketsService_1.prototype.getGuestPass = function (accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var guest, invitation, frontendUrl, validateUrl, qrDataUrl;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.guests.findOne({ where: { accessToken: accessToken } })];
                        case 1:
                            guest = _b.sent();
                            if (!guest) {
                                throw new common_1.NotFoundException('Invitación no encontrada');
                            }
                            return [4 /*yield*/, this.invitations.findOne({ where: { id: guest.invitationId } })];
                        case 2:
                            invitation = _b.sent();
                            if (!(invitation === null || invitation === void 0 ? void 0 : invitation.ticketsEnabled)) {
                                return [2 /*return*/, { hasPass: false, reason: 'tickets_disabled' }];
                            }
                            if (guest.rsvpStatus !== guest_entity_1.RsvpStatus.Confirmed) {
                                return [2 /*return*/, { hasPass: false, reason: 'not_confirmed' }];
                            }
                            if (!!guest.ticketToken) return [3 /*break*/, 4];
                            guest.ticketToken = (0, crypto_1.randomBytes)(18).toString('hex');
                            return [4 /*yield*/, this.guests.save(guest)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            frontendUrl = (_a = this.config.get('FRONTEND_URL')) !== null && _a !== void 0 ? _a : 'http://localhost:4300';
                            validateUrl = "".concat(frontendUrl, "/validar/").concat(guest.ticketToken);
                            return [4 /*yield*/, QRCode.toDataURL(validateUrl, { margin: 1, width: 240 })];
                        case 5:
                            qrDataUrl = _b.sent();
                            return [2 /*return*/, {
                                    hasPass: true,
                                    guestName: guest.name,
                                    seats: guest.confirmedSeats,
                                    qrDataUrl: qrDataUrl,
                                }];
                    }
                });
            });
        };
        // Consulta el estado de un pase (sin registrar entrada). Para la pantalla del staff.
        TicketsService_1.prototype.inspect = function (ticketToken, user) {
            return __awaiter(this, void 0, void 0, function () {
                var guest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.guests.findOne({ where: { ticketToken: ticketToken } })];
                        case 1:
                            guest = _a.sent();
                            if (!guest) {
                                throw new common_1.NotFoundException('Pase no encontrado');
                            }
                            return [4 /*yield*/, this.assertCanValidate(guest.invitationId, user)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.toResult(guest)];
                    }
                });
            });
        };
        // Registra la entrada. Idempotente: si ya ingresó, informa 'already_used'.
        TicketsService_1.prototype.checkIn = function (ticketToken, user) {
            return __awaiter(this, void 0, void 0, function () {
                var guest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.guests.findOne({ where: { ticketToken: ticketToken } })];
                        case 1:
                            guest = _a.sent();
                            if (!guest) {
                                throw new common_1.NotFoundException('Pase no encontrado');
                            }
                            return [4 /*yield*/, this.assertCanValidate(guest.invitationId, user)];
                        case 2:
                            _a.sent();
                            if (guest.rsvpStatus !== guest_entity_1.RsvpStatus.Confirmed) {
                                throw new common_1.BadRequestException('El invitado no confirmó asistencia');
                            }
                            if (guest.checkedInAt) {
                                return [2 /*return*/, this.toResult(guest)]; // ya usado: no vuelve a marcar
                            }
                            // Primer ingreso: registra la entrada y responde 'valid'.
                            guest.checkedInAt = new Date();
                            return [4 /*yield*/, this.guests.save(guest)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {
                                    state: 'valid',
                                    guestName: guest.name,
                                    confirmedSeats: guest.confirmedSeats,
                                    checkedInAt: guest.checkedInAt.toISOString(),
                                }];
                    }
                });
            });
        };
        // Asigna un usuario (por correo) como personal de acceso del evento.
        TicketsService_1.prototype.assignStaff = function (invitationId, ownerId, email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertOwner(invitationId, ownerId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.users.findOne({ where: { email: email.toLowerCase().trim() } })];
                        case 2:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('No existe un usuario con ese correo');
                            }
                            if (!(user.role === user_entity_1.UserRole.Organizer)) return [3 /*break*/, 4];
                            user.role = user_entity_1.UserRole.Staff;
                            return [4 /*yield*/, this.users.save(user)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.assignments.findOne({
                                where: { invitationId: invitationId, userId: user.id },
                            })];
                        case 5:
                            existing = _a.sent();
                            if (existing) {
                                return [2 /*return*/, existing];
                            }
                            return [2 /*return*/, this.assignments.save(this.assignments.create({ invitationId: invitationId, userId: user.id }))];
                    }
                });
            });
        };
        TicketsService_1.prototype.toResult = function (guest) {
            var state = guest.rsvpStatus !== guest_entity_1.RsvpStatus.Confirmed
                ? 'not_confirmed'
                : guest.checkedInAt
                    ? 'already_used'
                    : 'valid';
            return {
                state: state,
                guestName: guest.name,
                confirmedSeats: guest.confirmedSeats,
                checkedInAt: guest.checkedInAt ? guest.checkedInAt.toISOString() : null,
            };
        };
        return TicketsService_1;
    }());
    __setFunctionName(_classThis, "TicketsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TicketsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TicketsService = _classThis;
}();
exports.TicketsService = TicketsService;
