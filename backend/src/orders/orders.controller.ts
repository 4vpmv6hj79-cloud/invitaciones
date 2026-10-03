import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateDesignOrderDto } from './dto/create-design-order.dto';
import { CurrentUser, Public } from '../auth/decorators';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  // Inicia el pago. POST /orders (solo el dueño de la invitación)
  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: { id: string }) {
    return this.service.createCheckout(dto.invitationId, user.id);
  }

  // Inicia el pago de una solicitud de diseño. POST /orders/design
  @Post('design')
  createDesign(
    @Body() dto: CreateDesignOrderDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.createDesignCheckout(dto.designRequestId, user.id);
  }

  // Estado del pedido (para la pantalla de retorno). GET /orders/:id
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const order = await this.service.findOne(id);
    return { id: order.id, status: order.status, invitationId: order.invitationId };
  }

  // Webhook de Stripe. Requiere el cuerpo crudo para verificar la firma.
  // Público: Stripe no envía JWT; la autenticidad se valida por la firma.
  // POST /orders/webhook
  @Public()
  @Post('webhook')
  async webhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    if (!this.service.isStripeEnabled) {
      // En modo simulado no se usan webhooks.
      return { received: true, ignored: true };
    }
    if (!req.rawBody || !signature) {
      throw new BadRequestException('Falta el cuerpo o la firma del webhook');
    }
    try {
      const event = this.service.verifyStripeSignature(req.rawBody, signature);
      await this.service.handleStripeEvent(event);
      return { received: true };
    } catch {
      // Firma inválida u otro error: no revelar detalles.
      throw new BadRequestException('Webhook no válido');
    }
  }
}
