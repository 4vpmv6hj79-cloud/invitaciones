import { OrdersService } from './orders.service';
import { OrderStatus } from './order.entity';
export declare class AdminOrdersController {
    private readonly service;
    constructor(service: OrdersService);
    listOrders(status?: OrderStatus): Promise<import("./order.entity").Order[]>;
    getOrder(id: string): Promise<import("./order.entity").Order>;
    refund(id: string): Promise<import("./order.entity").Order>;
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
