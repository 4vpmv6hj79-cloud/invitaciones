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
exports.GuestsController = void 0;
var common_1 = require("@nestjs/common");
// Gestión de invitados por el organizador DUEÑO de la invitación (guard global + propiedad).
var GuestsController = function () {
    var _classDecorators = [(0, common_1.Controller)('invitations/:invitationId/guests')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createGuest_decorators;
    var _createGroup_decorators;
    var _list_decorators;
    var _summary_decorators;
    var _export_decorators;
    var _import_decorators;
    var _remove_decorators;
    var GuestsController = _classThis = /** @class */ (function () {
        function GuestsController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        GuestsController_1.prototype.createGuest = function (invitationId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.service.assertOwner(invitationId, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.service.createGuest(invitationId, dto)];
                    }
                });
            });
        };
        GuestsController_1.prototype.createGroup = function (invitationId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.service.assertOwner(invitationId, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.service.createGroup(invitationId, dto)];
                    }
                });
            });
        };
        GuestsController_1.prototype.list = function (invitationId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.service.assertOwner(invitationId, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.service.listGuests(invitationId)];
                    }
                });
            });
        };
        GuestsController_1.prototype.summary = function (invitationId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.service.assertOwner(invitationId, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.service.summary(invitationId)];
                    }
                });
            });
        };
        GuestsController_1.prototype.export = function (invitationId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.service.assertOwner(invitationId, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.service.exportCsv(invitationId)];
                    }
                });
            });
        };
        GuestsController_1.prototype.import = function (invitationId, csv, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.service.assertOwner(invitationId, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.service.importCsv(invitationId, csv !== null && csv !== void 0 ? csv : '')];
                    }
                });
            });
        };
        GuestsController_1.prototype.remove = function (invitationId, guestId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.service.assertOwner(invitationId, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.service.removeGuest(invitationId, guestId)];
                    }
                });
            });
        };
        return GuestsController_1;
    }());
    __setFunctionName(_classThis, "GuestsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createGuest_decorators = [(0, common_1.Post)()];
        _createGroup_decorators = [(0, common_1.Post)('groups')];
        _list_decorators = [(0, common_1.Get)()];
        _summary_decorators = [(0, common_1.Get)('summary')];
        _export_decorators = [(0, common_1.Get)('export'), (0, common_1.Header)('Content-Type', 'text/csv; charset=utf-8'), (0, common_1.Header)('Content-Disposition', 'attachment; filename="invitados.csv"')];
        _import_decorators = [(0, common_1.Post)('import')];
        _remove_decorators = [(0, common_1.Delete)(':guestId')];
        __esDecorate(_classThis, null, _createGuest_decorators, { kind: "method", name: "createGuest", static: false, private: false, access: { has: function (obj) { return "createGuest" in obj; }, get: function (obj) { return obj.createGuest; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createGroup_decorators, { kind: "method", name: "createGroup", static: false, private: false, access: { has: function (obj) { return "createGroup" in obj; }, get: function (obj) { return obj.createGroup; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _summary_decorators, { kind: "method", name: "summary", static: false, private: false, access: { has: function (obj) { return "summary" in obj; }, get: function (obj) { return obj.summary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _export_decorators, { kind: "method", name: "export", static: false, private: false, access: { has: function (obj) { return "export" in obj; }, get: function (obj) { return obj.export; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _import_decorators, { kind: "method", name: "import", static: false, private: false, access: { has: function (obj) { return "import" in obj; }, get: function (obj) { return obj.import; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GuestsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GuestsController = _classThis;
}();
exports.GuestsController = GuestsController;
