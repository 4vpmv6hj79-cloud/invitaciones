import { Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateDesignOrderDto } from './dto/create-design-order.dto';
export declare class OrdersController {
    private readonly service;
    constructor(service: OrdersService);
    create(dto: CreateOrderDto, user: {
        id: string;
    }): Promise<import("./orders.service").CheckoutResult>;
    createDesign(dto: CreateDesignOrderDto, user: {
        id: string;
    }): Promise<import("./orders.service").CheckoutResult>;
    findOne(id: string): Promise<{
        id: string;
        status: import("./order.entity").OrderStatus;
        invitationId: string | null;
    }>;
    webhook(req: Request & {
        rawBody?: Buffer;
    }, signature: string): Promise<{
        received: boolean;
        ignored: boolean;
    } | {
        received: boolean;
        ignored?: undefined;
    }>;
}
