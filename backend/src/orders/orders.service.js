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
exports.OrdersService = void 0;
var common_1 = require("@nestjs/common");
var stripe_1 = require("stripe");
var order_entity_1 = require("./order.entity");
var OrdersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OrdersService = _classThis = /** @class */ (function () {
        function OrdersService_1(orders, invitations, invitationsService, designService, config) {
            this.orders = orders;
            this.invitations = invitations;
            this.invitationsService = invitationsService;
            this.designService = designService;
            this.config = config;
            this.logger = new common_1.Logger(OrdersService.name);
            var secret = this.config.get('STRIPE_SECRET_KEY');
            // Si no hay clave, operamos en modo simulado (desarrollo).
            this.stripe = secret ? new stripe_1.default(secret) : null;
        }
        Object.defineProperty(OrdersService_1.prototype, "priceCents", {
            get: function () {
                var _a;
                return Number((_a = this.config.get('PUBLISH_PRICE_CENTS')) !== null && _a !== void 0 ? _a : 19900);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrdersService_1.prototype, "validityDays", {
            get: function () {
                var _a;
                return Number((_a = this.config.get('PUBLISH_VALIDITY_DAYS')) !== null && _a !== void 0 ? _a : 180);
            },
            enumerable: false,
            configurable: true
        });
        // Inicia el pago de la publicación de una invitación.
        OrdersService_1.prototype.createCheckout = function (invitationId, ownerId) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation, useStripe, order, frontendUrl, session;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.invitations.findOne({ where: { id: invitationId } })];
                        case 1:
                            invitation = _b.sent();
                            if (!invitation) {
                                throw new common_1.NotFoundException('Invitación no encontrada');
                            }
                            // Solo el dueño puede pagar la publicación de su invitación.
                            if (invitation.ownerId && invitation.ownerId !== ownerId) {
                                throw new common_1.ForbiddenException('No tienes acceso a esta invitación');
                            }
                            useStripe = this.stripe !== null;
                            return [4 /*yield*/, this.orders.save(this.orders.create({
                                    kind: order_entity_1.OrderKind.InvitationPublish,
                                    invitationId: invitationId,
                                    amount: this.priceCents,
                                    currency: 'MXN',
                                    status: order_entity_1.OrderStatus.Pending,
                                    provider: useStripe ? order_entity_1.PaymentProvider.Stripe : order_entity_1.PaymentProvider.Simulated,
                                }))];
                        case 2:
                            order = _b.sent();
                            if (!!useStripe) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.confirmPaid(order.id, 'simulated')];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, { orderId: order.id, checkoutUrl: null, simulated: true }];
                        case 4:
                            frontendUrl = (_a = this.config.get('FRONTEND_URL')) !== null && _a !== void 0 ? _a : 'http://localhost:4300';
                            return [4 /*yield*/, this.stripe.checkout.sessions.create({
                                    mode: 'payment',
                                    line_items: [
                                        {
                                            price_data: {
                                                currency: 'mxn',
                                                product_data: { name: 'Publicación de invitación digital' },
                                                unit_amount: this.priceCents,
                                            },
                                            quantity: 1,
                                        },
                                    ],
                                    // Vincula la sesión con nuestro pedido para el webhook.
                                    metadata: { orderId: order.id },
                                    success_url: "".concat(frontendUrl, "/pago/exito?order=").concat(order.id),
                                    cancel_url: "".concat(frontendUrl, "/editor/").concat(invitationId, "?pago=cancelado"),
                                })];
                        case 5:
                            session = _b.sent();
                            order.paymentRef = session.id;
                            return [4 /*yield*/, this.orders.save(order)];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, { orderId: order.id, checkoutUrl: session.url, simulated: false }];
                    }
                });
            });
        };
        // Inicia el pago de una solicitud de diseño a medida (precio fijado por el admin).
        OrdersService_1.prototype.createDesignCheckout = function (designRequestId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var request, amount, useStripe, order, frontendUrl, session;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.designService.getPayable(designRequestId, userId)];
                        case 1:
                            request = _b.sent();
                            amount = request.priceCents;
                            useStripe = this.stripe !== null;
                            return [4 /*yield*/, this.orders.save(this.orders.create({
                                    kind: order_entity_1.OrderKind.DesignService,
                                    designRequestId: designRequestId,
                                    amount: amount,
                                    currency: 'MXN',
                                    status: order_entity_1.OrderStatus.Pending,
                                    provider: useStripe ? order_entity_1.PaymentProvider.Stripe : order_entity_1.PaymentProvider.Simulated,
                                }))];
                        case 2:
                            order = _b.sent();
                            if (!!useStripe) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.confirmPaid(order.id, 'simulated')];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, { orderId: order.id, checkoutUrl: null, simulated: true }];
                        case 4:
                            frontendUrl = (_a = this.config.get('FRONTEND_URL')) !== null && _a !== void 0 ? _a : 'http://localhost:4300';
                            return [4 /*yield*/, this.stripe.checkout.sessions.create({
                                    mode: 'payment',
                                    line_items: [
                                        {
                                            price_data: {
                                                currency: 'mxn',
                                                product_data: { name: 'Diseño a medida' },
                                                unit_amount: amount,
                                            },
                                            quantity: 1,
                                        },
                                    ],
                                    metadata: { orderId: order.id },
                                    success_url: "".concat(frontendUrl, "/pago/exito?order=").concat(order.id),
                                    cancel_url: "".concat(frontendUrl, "/solicitudes/").concat(designRequestId, "?pago=cancelado"),
                                })];
                        case 5:
                            session = _b.sent();
                            order.paymentRef = session.id;
                            return [4 /*yield*/, this.orders.save(order)];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, { orderId: order.id, checkoutUrl: session.url, simulated: false }];
                    }
                });
            });
        };
        // Marca el pedido como pagado y ejecuta la entrega según el tipo. Idempotente.
        OrdersService_1.prototype.confirmPaid = function (orderId, paymentRef) {
            return __awaiter(this, void 0, void 0, function () {
                var order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.orders.findOne({ where: { id: orderId } })];
                        case 1:
                            order = _a.sent();
                            if (!order) {
                                throw new common_1.NotFoundException('Pedido no encontrado');
                            }
                            if (order.status === order_entity_1.OrderStatus.Paid) {
                                return [2 /*return*/, order]; // ya procesado
                            }
                            order.status = order_entity_1.OrderStatus.Paid;
                            order.paymentRef = paymentRef;
                            return [4 /*yield*/, this.orders.save(order)];
                        case 2:
                            _a.sent();
                            if (!(order.kind === order_entity_1.OrderKind.DesignService && order.designRequestId)) return [3 /*break*/, 4];
                            // Diseño a medida: aprueba y marca pagada la solicitud.
                            return [4 /*yield*/, this.designService.markApprovedPaid(order.designRequestId)];
                        case 3:
                            // Diseño a medida: aprueba y marca pagada la solicitud.
                            _a.sent();
                            this.logger.log("Pedido ".concat(orderId, " pagado; dise\u00F1o ").concat(order.designRequestId, " aprobado."));
                            return [3 /*break*/, 6];
                        case 4:
                            if (!order.invitationId) return [3 /*break*/, 6];
                            // Publicación de invitación: genera enlace y vigencia.
                            return [4 /*yield*/, this.invitationsService.publish(order.invitationId, this.validityDays)];
                        case 5:
                            // Publicación de invitación: genera enlace y vigencia.
                            _a.sent();
                            this.logger.log("Pedido ".concat(orderId, " pagado; invitaci\u00F3n ").concat(order.invitationId, " publicada."));
                            _a.label = 6;
                        case 6: return [2 /*return*/, order];
                    }
                });
            });
        };
        OrdersService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.orders.findOne({ where: { id: id } })];
                        case 1:
                            order = _a.sent();
                            if (!order) {
                                throw new common_1.NotFoundException('Pedido no encontrado');
                            }
                            return [2 /*return*/, order];
                    }
                });
            });
        };
        // Procesa el evento de webhook de Stripe ya verificado.
        OrdersService_1.prototype.handleStripeEvent = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var session, orderId;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(event.type === 'checkout.session.completed')) return [3 /*break*/, 2];
                            session = event.data.object;
                            orderId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
                            if (!orderId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.confirmPaid(orderId, session.id)];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        // Verifica la firma del webhook con el secret configurado.
        OrdersService_1.prototype.verifyStripeSignature = function (payload, signature) {
            var whSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
            if (!this.stripe || !whSecret) {
                throw new Error('Stripe no está configurado para webhooks');
            }
            return this.stripe.webhooks.constructEvent(payload, signature, whSecret);
        };
        Object.defineProperty(OrdersService_1.prototype, "isStripeEnabled", {
            get: function () {
                return this.stripe !== null;
            },
            enumerable: false,
            configurable: true
        });
        // ---- Administración (solo rol admin) ----
        // Lista pedidos, opcionalmente filtrados por estado. Incluye la invitación (eager).
        OrdersService_1.prototype.listOrders = function (status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orders.find({
                            where: status ? { status: status } : {},
                            order: { createdAt: 'DESC' },
                        })];
                });
            });
        };
        // Reembolsa un pedido pagado. En Stripe crea un refund real (modo test);
        // en modo simulado solo marca el estado. Idempotente.
        OrdersService_1.prototype.refund = function (orderId) {
            return __awaiter(this, void 0, void 0, function () {
                var order, session, paymentIntent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(orderId)];
                        case 1:
                            order = _a.sent();
                            if (order.status === order_entity_1.OrderStatus.Refunded) {
                                return [2 /*return*/, order]; // ya reembolsado
                            }
                            if (order.status !== order_entity_1.OrderStatus.Paid) {
                                throw new common_1.BadRequestException('Solo se pueden reembolsar pedidos pagados');
                            }
                            if (!(this.stripe && order.paymentRef && order.provider === order_entity_1.PaymentProvider.Stripe)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.stripe.checkout.sessions.retrieve(order.paymentRef)];
                        case 2:
                            session = _a.sent();
                            paymentIntent = session.payment_intent;
                            if (!paymentIntent) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.stripe.refunds.create({ payment_intent: paymentIntent })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            order.status = order_entity_1.OrderStatus.Refunded;
                            return [4 /*yield*/, this.orders.save(order)];
                        case 5:
                            _a.sent();
                            this.logger.log("Pedido ".concat(orderId, " reembolsado."));
                            return [2 /*return*/, order];
                    }
                });
            });
        };
        // Reporte de ventas. Los costos son estimaciones (hipótesis a validar), no cifras reales.
        OrdersService_1.prototype.salesReport = function () {
            return __awaiter(this, void 0, void 0, function () {
                var all, byStatus, _i, all_1, o, paid, gross, estimatedFees;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.orders.find()];
                        case 1:
                            all = _b.sent();
                            byStatus = {};
                            for (_i = 0, all_1 = all; _i < all_1.length; _i++) {
                                o = all_1[_i];
                                byStatus[o.status] = ((_a = byStatus[o.status]) !== null && _a !== void 0 ? _a : 0) + 1;
                            }
                            paid = all.filter(function (o) { return o.status === order_entity_1.OrderStatus.Paid; });
                            gross = paid.reduce(function (sum, o) { return sum + o.amount; }, 0);
                            estimatedFees = paid.reduce(function (sum, o) { return sum + Math.round(o.amount * 0.036) + 300; }, 0);
                            return [2 /*return*/, {
                                    totalOrders: all.length,
                                    byStatus: byStatus,
                                    paidOrders: paid.length,
                                    grossRevenueCents: gross,
                                    estimatedFeesCents: estimatedFees,
                                    estimatedNetCents: gross - estimatedFees,
                                    currency: 'MXN',
                                    note: 'Los costos de pasarela son una estimación por validar, no cifras reales.',
                                }];
                    }
                });
            });
        };
        return OrdersService_1;
    }());
    __setFunctionName(_classThis, "OrdersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersService = _classThis;
}();
exports.OrdersService = OrdersService;
