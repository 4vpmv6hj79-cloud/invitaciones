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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsService = void 0;
var common_1 = require("@nestjs/common");
var crypto_1 = require("crypto");
var guest_entity_1 = require("./guest.entity");
var GuestsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GuestsService = _classThis = /** @class */ (function () {
        function GuestsService_1(guests, groups, invitations) {
            this.guests = guests;
            this.groups = groups;
            this.invitations = invitations;
        }
        // Verifica que el usuario sea dueño de la invitación antes de gestionar invitados.
        GuestsService_1.prototype.assertOwner = function (invitationId, ownerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.invitations.findOwned(invitationId, ownerId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ---- Organizador ----
        GuestsService_1.prototype.createGuest = function (invitationId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var guest;
                var _a, _b;
                return __generator(this, function (_c) {
                    guest = this.guests.create({
                        invitationId: invitationId,
                        name: dto.name,
                        contact: (_a = dto.contact) !== null && _a !== void 0 ? _a : null,
                        allowedSeats: dto.allowedSeats,
                        rsvpMode: dto.rsvpMode === 'cerrado' ? guest_entity_1.GuestRsvpMode.Cerrado : guest_entity_1.GuestRsvpMode.Abierto,
                        groupId: (_b = dto.groupId) !== null && _b !== void 0 ? _b : null,
                        accessToken: (0, crypto_1.randomBytes)(18).toString('hex'),
                    });
                    return [2 /*return*/, this.guests.save(guest)];
                });
            });
        };
        GuestsService_1.prototype.createGroup = function (invitationId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var group;
                return __generator(this, function (_a) {
                    group = this.groups.create({
                        invitationId: invitationId,
                        name: dto.name,
                        allowedSeats: dto.allowedSeats,
                    });
                    return [2 /*return*/, this.groups.save(group)];
                });
            });
        };
        GuestsService_1.prototype.listGuests = function (invitationId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.guests.find({
                            where: { invitationId: invitationId },
                            order: { createdAt: 'ASC' },
                        })];
                });
            });
        };
        // Resumen de confirmaciones para el panel del organizador.
        GuestsService_1.prototype.summary = function (invitationId) {
            return __awaiter(this, void 0, void 0, function () {
                var guests;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.listGuests(invitationId)];
                        case 1:
                            guests = _a.sent();
                            return [2 /*return*/, {
                                    total: guests.length,
                                    confirmed: guests.filter(function (g) { return g.rsvpStatus === guest_entity_1.RsvpStatus.Confirmed; }).length,
                                    declined: guests.filter(function (g) { return g.rsvpStatus === guest_entity_1.RsvpStatus.Declined; }).length,
                                    pending: guests.filter(function (g) { return g.rsvpStatus === guest_entity_1.RsvpStatus.Pending; }).length,
                                    seatsConfirmed: guests.reduce(function (sum, g) { return sum + g.confirmedSeats; }, 0),
                                    seatsAllowed: guests.reduce(function (sum, g) { return sum + g.allowedSeats; }, 0),
                                }];
                    }
                });
            });
        };
        GuestsService_1.prototype.removeGuest = function (invitationId, guestId) {
            return __awaiter(this, void 0, void 0, function () {
                var guest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.guests.findOne({ where: { id: guestId, invitationId: invitationId } })];
                        case 1:
                            guest = _a.sent();
                            if (!guest) {
                                throw new common_1.NotFoundException('Invitado no encontrado');
                            }
                            return [4 /*yield*/, this.guests.remove(guest)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ---- Invitado (enlace privado por token) ----
        // Datos mínimos del invitado para su enlace privado. No expone a otros invitados.
        GuestsService_1.prototype.getByToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var guest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.guests.findOne({ where: { accessToken: token } })];
                        case 1:
                            guest = _a.sent();
                            if (!guest) {
                                throw new common_1.NotFoundException('Invitación no encontrada');
                            }
                            return [2 /*return*/, guest];
                    }
                });
            });
        };
        // ---- RSVP público (enlace compartido /i/:token) ----
        // Confirma asistencia desde el enlace público general: crea un invitado
        // auto-registrado en la invitación publicada. Así un solo enlace sirve para
        // todos los invitados, que confirman poniendo su nombre.
        GuestsService_1.prototype.publicRsvp = function (publicToken, data) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation, name, declined, seats, guest;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.invitations.getPublishedByToken(publicToken)];
                        case 1:
                            invitation = _c.sent();
                            if (invitation.expiresAt && invitation.expiresAt < new Date()) {
                                throw new common_1.BadRequestException('Esta invitación ya no está disponible');
                            }
                            name = ((_a = data.name) !== null && _a !== void 0 ? _a : '').trim();
                            if (!name) {
                                throw new common_1.BadRequestException('Escribe tu nombre para confirmar');
                            }
                            declined = data.status === 'declined';
                            seats = declined ? 0 : Math.max(1, Number(data.seats) || 1);
                            guest = this.guests.create({
                                invitationId: invitation.id,
                                name: name,
                                contact: null,
                                // Auto-registrado: autorizamos los lugares que indica (no hay tope previo).
                                allowedSeats: declined ? 1 : seats,
                                confirmedSeats: seats,
                                rsvpStatus: declined ? guest_entity_1.RsvpStatus.Declined : guest_entity_1.RsvpStatus.Confirmed,
                                dietaryNotes: ((_b = data.dietaryNotes) === null || _b === void 0 ? void 0 : _b.trim()) || null,
                                accessToken: (0, crypto_1.randomBytes)(18).toString('hex'),
                                respondedAt: new Date(),
                            });
                            return [4 /*yield*/, this.guests.save(guest)];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, { ok: true, status: guest.rsvpStatus }];
                    }
                });
            });
        };
        // Confirmación de asistencia con control de lugares.
        GuestsService_1.prototype.respond = function (token, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var guest, seats;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getByToken(token)];
                        case 1:
                            guest = _b.sent();
                            if (dto.status === 'declined') {
                                guest.rsvpStatus = guest_entity_1.RsvpStatus.Declined;
                                guest.confirmedSeats = 0;
                            }
                            else if (guest.rsvpMode === guest_entity_1.GuestRsvpMode.Cerrado) {
                                // Modo cerrado: confirma exactamente los lugares autorizados (no elige cantidad).
                                guest.rsvpStatus = guest_entity_1.RsvpStatus.Confirmed;
                                guest.confirmedSeats = guest.allowedSeats;
                            }
                            else {
                                seats = (_a = dto.seats) !== null && _a !== void 0 ? _a : 1;
                                if (seats < 1) {
                                    throw new common_1.BadRequestException('Debes confirmar al menos un lugar');
                                }
                                // Regla clave: no se pueden confirmar más lugares de los autorizados.
                                if (seats > guest.allowedSeats) {
                                    throw new common_1.BadRequestException("Solo tienes ".concat(guest.allowedSeats, " lugar(es) autorizado(s)"));
                                }
                                guest.rsvpStatus = guest_entity_1.RsvpStatus.Confirmed;
                                guest.confirmedSeats = seats;
                            }
                            if (dto.dietaryNotes !== undefined) {
                                guest.dietaryNotes = dto.dietaryNotes;
                            }
                            guest.respondedAt = new Date();
                            return [2 /*return*/, this.guests.save(guest)];
                    }
                });
            });
        };
        // ---- CSV ----
        GuestsService_1.prototype.exportCsv = function (invitationId) {
            return __awaiter(this, void 0, void 0, function () {
                var guests, header, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.listGuests(invitationId)];
                        case 1:
                            guests = _a.sent();
                            header = 'nombre,contacto,lugares_autorizados,estado,lugares_confirmados';
                            rows = guests.map(function (g) {
                                var _a;
                                return [
                                    _this.csvCell(g.name),
                                    _this.csvCell((_a = g.contact) !== null && _a !== void 0 ? _a : ''),
                                    g.allowedSeats,
                                    g.rsvpStatus,
                                    g.confirmedSeats,
                                ].join(',');
                            });
                            return [2 /*return*/, __spreadArray([header], rows, true).join('\n')];
                    }
                });
            });
        };
        // Importa invitados desde CSV (nombre, contacto?, lugares_autorizados).
        GuestsService_1.prototype.importCsv = function (invitationId, csv) {
            return __awaiter(this, void 0, void 0, function () {
                var lines, start, imported, i, cols, name_1, contact, seats, allowedSeats;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            lines = csv
                                .split(/\r?\n/)
                                .map(function (l) { return l.trim(); })
                                .filter(function (l) { return l.length > 0; });
                            start = ((_a = lines[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('nombre')) ? 1 : 0;
                            imported = 0;
                            i = start;
                            _e.label = 1;
                        case 1:
                            if (!(i < lines.length)) return [3 /*break*/, 4];
                            cols = this.parseCsvLine(lines[i]);
                            name_1 = (_b = cols[0]) === null || _b === void 0 ? void 0 : _b.trim();
                            if (!name_1)
                                return [3 /*break*/, 3];
                            contact = ((_c = cols[1]) === null || _c === void 0 ? void 0 : _c.trim()) || null;
                            seats = Number.parseInt((_d = cols[2]) !== null && _d !== void 0 ? _d : '1', 10);
                            allowedSeats = Number.isFinite(seats) && seats > 0 ? seats : 1;
                            return [4 /*yield*/, this.guests.save(this.guests.create({
                                    invitationId: invitationId,
                                    name: name_1,
                                    contact: contact,
                                    allowedSeats: allowedSeats,
                                    accessToken: (0, crypto_1.randomBytes)(18).toString('hex'),
                                }))];
                        case 2:
                            _e.sent();
                            imported += 1;
                            _e.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, { imported: imported }];
                    }
                });
            });
        };
        GuestsService_1.prototype.csvCell = function (value) {
            // Escapa comillas y envuelve si hay comas o saltos.
            if (/[",\n]/.test(value)) {
                return "\"".concat(value.replace(/"/g, '""'), "\"");
            }
            return value;
        };
        GuestsService_1.prototype.parseCsvLine = function (line) {
            var result = [];
            var current = '';
            var inQuotes = false;
            for (var i = 0; i < line.length; i++) {
                var ch = line[i];
                if (inQuotes) {
                    if (ch === '"' && line[i + 1] === '"') {
                        current += '"';
                        i++;
                    }
                    else if (ch === '"') {
                        inQuotes = false;
                    }
                    else {
                        current += ch;
                    }
                }
                else if (ch === '"') {
                    inQuotes = true;
                }
                else if (ch === ',') {
                    result.push(current);
                    current = '';
                }
                else {
                    current += ch;
                }
            }
            result.push(current);
            return result;
        };
        return GuestsService_1;
    }());
    __setFunctionName(_classThis, "GuestsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GuestsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GuestsService = _classThis;
}();
exports.GuestsService = GuestsService;
