import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Order, OrderStatus } from './order.entity';
import { Invitation } from '../invitations/invitation.entity';
import { InvitationsService } from '../invitations/invitations.service';
import { DesignService } from '../design/design.service';
export interface CheckoutResult {
    orderId: string;
    checkoutUrl: string | null;
    simulated: boolean;
}
export declare class OrdersService {
    private readonly orders;
    private readonly invitations;
    private readonly invitationsService;
    private readonly designService;
    private readonly config;
    private readonly logger;
    private readonly stripe;
    constructor(orders: Repository<Order>, invitations: Repository<Invitation>, invitationsService: InvitationsService, designService: DesignService, config: ConfigService);
    private get priceCents();
    private get validityDays();
    createCheckout(invitationId: string, ownerId: string): Promise<CheckoutResult>;
    createDesignCheckout(designRequestId: string, userId: string): Promise<CheckoutResult>;
    confirmPaid(orderId: string, paymentRef: string): Promise<Order>;
    findOne(id: string): Promise<Order>;
    handleStripeEvent(event: Stripe.Event): Promise<void>;
    verifyStripeSignature(payload: Buffer, signature: string): Stripe.Event;
    get isStripeEnabled(): boolean;
    listOrders(status?: OrderStatus): Promise<Order[]>;
    refund(orderId: string): Promise<Order>;
    salesReport(): Promise<{
        totalOrders: number;
        byStatus: Record<string, number>;
        paidOrders: number;
        grossRevenueCents: number;
        estimatedFeesCents: number;
        estimatedNetCents: number;
        currency: string;
        note: string;
    }>;
}
