"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stripe_1 = __importDefault(require("stripe"));
const order_entity_1 = require("./order.entity");
const invitation_entity_1 = require("../invitations/invitation.entity");
const invitations_service_1 = require("../invitations/invitations.service");
const design_service_1 = require("../design/design.service");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(orders, invitations, invitationsService, designService, config) {
        this.orders = orders;
        this.invitations = invitations;
        this.invitationsService = invitationsService;
        this.designService = designService;
        this.config = config;
        this.logger = new common_1.Logger(OrdersService_1.name);
        const secret = this.config.get('STRIPE_SECRET_KEY');
        this.stripe = secret ? new stripe_1.default(secret) : null;
    }
    get priceCents() {
        return Number(this.config.get('PUBLISH_PRICE_CENTS') ?? 19900);
    }
    get validityDays() {
        return Number(this.config.get('PUBLISH_VALIDITY_DAYS') ?? 180);
    }
    async createCheckout(invitationId, ownerId) {
        const invitation = await this.invitations.findOne({ where: { id: invitationId } });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitación no encontrada');
        }
        if (invitation.ownerId && invitation.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta invitación');
        }
        const useStripe = this.stripe !== null;
        const order = await this.orders.save(this.orders.create({
            kind: order_entity_1.OrderKind.InvitationPublish,
            invitationId,
            amount: this.priceCents,
            currency: 'MXN',
            status: order_entity_1.OrderStatus.Pending,
            provider: useStripe ? order_entity_1.PaymentProvider.Stripe : order_entity_1.PaymentProvider.Simulated,
        }));
        if (!useStripe) {
            await this.confirmPaid(order.id, 'simulated');
            return { orderId: order.id, checkoutUrl: null, simulated: true };
        }
        const frontendUrl = this.config.get('FRONTEND_URL') ?? 'http://localhost:4300';
        const session = await this.stripe.checkout.sessions.create({
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
            metadata: { orderId: order.id },
            success_url: `${frontendUrl}/pago/exito?order=${order.id}`,
            cancel_url: `${frontendUrl}/editor/${invitationId}?pago=cancelado`,
        });
        order.paymentRef = session.id;
        await this.orders.save(order);
        return { orderId: order.id, checkoutUrl: session.url, simulated: false };
    }
    async createDesignCheckout(designRequestId, userId) {
        const request = await this.designService.getPayable(designRequestId, userId);
        const amount = request.priceCents;
        const useStripe = this.stripe !== null;
        const order = await this.orders.save(this.orders.create({
            kind: order_entity_1.OrderKind.DesignService,
            designRequestId,
            amount,
            currency: 'MXN',
            status: order_entity_1.OrderStatus.Pending,
            provider: useStripe ? order_entity_1.PaymentProvider.Stripe : order_entity_1.PaymentProvider.Simulated,
        }));
        if (!useStripe) {
            await this.confirmPaid(order.id, 'simulated');
            return { orderId: order.id, checkoutUrl: null, simulated: true };
        }
        const frontendUrl = this.config.get('FRONTEND_URL') ?? 'http://localhost:4300';
        const session = await this.stripe.checkout.sessions.create({
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
            success_url: `${frontendUrl}/pago/exito?order=${order.id}`,
            cancel_url: `${frontendUrl}/solicitudes/${designRequestId}?pago=cancelado`,
        });
        order.paymentRef = session.id;
        await this.orders.save(order);
        return { orderId: order.id, checkoutUrl: session.url, simulated: false };
    }
    async confirmPaid(orderId, paymentRef) {
        const order = await this.orders.findOne({ where: { id: orderId } });
        if (!order) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        if (order.status === order_entity_1.OrderStatus.Paid) {
            return order;
        }
        order.status = order_entity_1.OrderStatus.Paid;
        order.paymentRef = paymentRef;
        await this.orders.save(order);
        if (order.kind === order_entity_1.OrderKind.DesignService && order.designRequestId) {
            await this.designService.markApprovedPaid(order.designRequestId);
            this.logger.log(`Pedido ${orderId} pagado; diseño ${order.designRequestId} aprobado.`);
        }
        else if (order.invitationId) {
            await this.invitationsService.publish(order.invitationId, this.validityDays);
            this.logger.log(`Pedido ${orderId} pagado; invitación ${order.invitationId} publicada.`);
        }
        return order;
    }
    async findOne(id) {
        const order = await this.orders.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        return order;
    }
    async handleStripeEvent(event) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;
            if (orderId) {
                await this.confirmPaid(orderId, session.id);
            }
        }
    }
    verifyStripeSignature(payload, signature) {
        const whSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
        if (!this.stripe || !whSecret) {
            throw new Error('Stripe no está configurado para webhooks');
        }
        return this.stripe.webhooks.constructEvent(payload, signature, whSecret);
    }
    get isStripeEnabled() {
        return this.stripe !== null;
    }
    async listOrders(status) {
        return this.orders.find({
            where: status ? { status } : {},
            order: { createdAt: 'DESC' },
        });
    }
    async refund(orderId) {
        const order = await this.findOne(orderId);
        if (order.status === order_entity_1.OrderStatus.Refunded) {
            return order;
        }
        if (order.status !== order_entity_1.OrderStatus.Paid) {
            throw new common_1.BadRequestException('Solo se pueden reembolsar pedidos pagados');
        }
        if (this.stripe && order.paymentRef && order.provider === order_entity_1.PaymentProvider.Stripe) {
            const session = await this.stripe.checkout.sessions.retrieve(order.paymentRef);
            const paymentIntent = session.payment_intent;
            if (paymentIntent) {
                await this.stripe.refunds.create({ payment_intent: paymentIntent });
            }
        }
        order.status = order_entity_1.OrderStatus.Refunded;
        await this.orders.save(order);
        this.logger.log(`Pedido ${orderId} reembolsado.`);
        return order;
    }
    async salesReport() {
        const all = await this.orders.find();
        const byStatus = {};
        for (const o of all) {
            byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
        }
        const paid = all.filter((o) => o.status === order_entity_1.OrderStatus.Paid);
        const gross = paid.reduce((sum, o) => sum + o.amount, 0);
        const estimatedFees = paid.reduce((sum, o) => sum + Math.round(o.amount * 0.036) + 300, 0);
        return {
            totalOrders: all.length,
            byStatus,
            paidOrders: paid.length,
            grossRevenueCents: gross,
            estimatedFeesCents: estimatedFees,
            estimatedNetCents: gross - estimatedFees,
            currency: 'MXN',
            note: 'Los costos de pasarela son una estimación por validar, no cifras reales.',
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(invitation_entity_1.Invitation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        invitations_service_1.InvitationsService,
        design_service_1.DesignService,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map