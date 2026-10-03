import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Order, OrderStatus, OrderKind, PaymentProvider } from './order.entity';
import { Invitation } from '../invitations/invitation.entity';
import { InvitationsService } from '../invitations/invitations.service';
import { DesignService } from '../design/design.service';

// Resultado de iniciar un pago: a dónde debe ir el usuario a continuación.
export interface CheckoutResult {
  orderId: string;
  // En Stripe: URL de Checkout. En simulado: null (se confirma directo).
  checkoutUrl: string | null;
  simulated: boolean;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly stripe: Stripe | null;

  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Invitation)
    private readonly invitations: Repository<Invitation>,
    private readonly invitationsService: InvitationsService,
    private readonly designService: DesignService,
    private readonly config: ConfigService,
  ) {
    const secret = this.config.get<string>('STRIPE_SECRET_KEY');
    // Si no hay clave, operamos en modo simulado (desarrollo).
    this.stripe = secret ? new Stripe(secret) : null;
  }

  private get priceCents(): number {
    return Number(this.config.get<string>('PUBLISH_PRICE_CENTS') ?? 19900);
  }

  private get validityDays(): number {
    return Number(this.config.get<string>('PUBLISH_VALIDITY_DAYS') ?? 180);
  }

  // Inicia el pago de la publicación de una invitación.
  async createCheckout(invitationId: string, ownerId: string): Promise<CheckoutResult> {
    const invitation = await this.invitations.findOne({ where: { id: invitationId } });
    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }
    // Solo el dueño puede pagar la publicación de su invitación.
    if (invitation.ownerId && invitation.ownerId !== ownerId) {
      throw new ForbiddenException('No tienes acceso a esta invitación');
    }

    const useStripe = this.stripe !== null;
    const order = await this.orders.save(
      this.orders.create({
        kind: OrderKind.InvitationPublish,
        invitationId,
        amount: this.priceCents,
        currency: 'MXN',
        status: OrderStatus.Pending,
        provider: useStripe ? PaymentProvider.Stripe : PaymentProvider.Simulated,
      }),
    );

    // Modo simulado: sin pasarela, confirmamos de inmediato (solo desarrollo).
    if (!useStripe) {
      await this.confirmPaid(order.id, 'simulated');
      return { orderId: order.id, checkoutUrl: null, simulated: true };
    }

    // Modo Stripe: creamos una sesión de Checkout.
    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:4300';
    const session = await this.stripe!.checkout.sessions.create({
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
      success_url: `${frontendUrl}/pago/exito?order=${order.id}`,
      cancel_url: `${frontendUrl}/editor/${invitationId}?pago=cancelado`,
    });

    order.paymentRef = session.id;
    await this.orders.save(order);

    return { orderId: order.id, checkoutUrl: session.url, simulated: false };
  }

  // Inicia el pago de una solicitud de diseño a medida (precio fijado por el admin).
  async createDesignCheckout(designRequestId: string, userId: string): Promise<CheckoutResult> {
    const request = await this.designService.getPayable(designRequestId, userId);
    const amount = request.priceCents as number;

    const useStripe = this.stripe !== null;
    const order = await this.orders.save(
      this.orders.create({
        kind: OrderKind.DesignService,
        designRequestId,
        amount,
        currency: 'MXN',
        status: OrderStatus.Pending,
        provider: useStripe ? PaymentProvider.Stripe : PaymentProvider.Simulated,
      }),
    );

    if (!useStripe) {
      await this.confirmPaid(order.id, 'simulated');
      return { orderId: order.id, checkoutUrl: null, simulated: true };
    }

    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:4300';
    const session = await this.stripe!.checkout.sessions.create({
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

  // Marca el pedido como pagado y ejecuta la entrega según el tipo. Idempotente.
  async confirmPaid(orderId: string, paymentRef: string): Promise<Order> {
    const order = await this.orders.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }
    if (order.status === OrderStatus.Paid) {
      return order; // ya procesado
    }

    order.status = OrderStatus.Paid;
    order.paymentRef = paymentRef;
    await this.orders.save(order);

    if (order.kind === OrderKind.DesignService && order.designRequestId) {
      // Diseño a medida: aprueba y marca pagada la solicitud.
      await this.designService.markApprovedPaid(order.designRequestId);
      this.logger.log(`Pedido ${orderId} pagado; diseño ${order.designRequestId} aprobado.`);
    } else if (order.invitationId) {
      // Publicación de invitación: genera enlace y vigencia.
      await this.invitationsService.publish(order.invitationId, this.validityDays);
      this.logger.log(`Pedido ${orderId} pagado; invitación ${order.invitationId} publicada.`);
    }
    return order;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }
    return order;
  }

  // Procesa el evento de webhook de Stripe ya verificado.
  async handleStripeEvent(event: Stripe.Event): Promise<void> {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await this.confirmPaid(orderId, session.id);
      }
    }
  }

  // Verifica la firma del webhook con el secret configurado.
  verifyStripeSignature(payload: Buffer, signature: string): Stripe.Event {
    const whSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!this.stripe || !whSecret) {
      throw new Error('Stripe no está configurado para webhooks');
    }
    return this.stripe.webhooks.constructEvent(payload, signature, whSecret);
  }

  get isStripeEnabled(): boolean {
    return this.stripe !== null;
  }

  // ---- Administración (solo rol admin) ----

  // Lista pedidos, opcionalmente filtrados por estado. Incluye la invitación (eager).
  async listOrders(status?: OrderStatus): Promise<Order[]> {
    return this.orders.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  // Reembolsa un pedido pagado. En Stripe crea un refund real (modo test);
  // en modo simulado solo marca el estado. Idempotente.
  async refund(orderId: string): Promise<Order> {
    const order = await this.findOne(orderId);
    if (order.status === OrderStatus.Refunded) {
      return order; // ya reembolsado
    }
    if (order.status !== OrderStatus.Paid) {
      throw new BadRequestException('Solo se pueden reembolsar pedidos pagados');
    }

    if (this.stripe && order.paymentRef && order.provider === PaymentProvider.Stripe) {
      // paymentRef es el id de la sesión de Checkout; recuperamos el payment_intent.
      const session = await this.stripe.checkout.sessions.retrieve(order.paymentRef);
      const paymentIntent = session.payment_intent as string | null;
      if (paymentIntent) {
        await this.stripe.refunds.create({ payment_intent: paymentIntent });
      }
    }

    order.status = OrderStatus.Refunded;
    await this.orders.save(order);
    this.logger.log(`Pedido ${orderId} reembolsado.`);
    return order;
  }

  // Reporte de ventas. Los costos son estimaciones (hipótesis a validar), no cifras reales.
  async salesReport(): Promise<{
    totalOrders: number;
    byStatus: Record<string, number>;
    paidOrders: number;
    grossRevenueCents: number;
    estimatedFeesCents: number;
    estimatedNetCents: number;
    currency: string;
    note: string;
  }> {
    const all = await this.orders.find();
    const byStatus: Record<string, number> = {};
    for (const o of all) {
      byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    }
    const paid = all.filter((o) => o.status === OrderStatus.Paid);
    const gross = paid.reduce((sum, o) => sum + o.amount, 0);
    // Estimación de comisión de pasarela: HIPÓTESIS (3.6% + 3 MXN por transacción).
    // Debe validarse con las tarifas reales de Stripe México.
    const estimatedFees = paid.reduce(
      (sum, o) => sum + Math.round(o.amount * 0.036) + 300,
      0,
    );
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
}
