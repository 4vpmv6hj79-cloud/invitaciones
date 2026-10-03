import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './order.entity';
import { Roles } from '../auth/decorators';
import { UserRole } from '../auth/user.entity';

// Panel de administración de pedidos. Solo rol admin (guard global + @Roles).
@Roles(UserRole.Admin)
@Controller('admin')
export class AdminOrdersController {
  constructor(private readonly service: OrdersService) {}

  // Lista de pedidos, filtrable por estado. GET /admin/orders?status=paid
  @Get('orders')
  listOrders(@Query('status') status?: OrderStatus) {
    return this.service.listOrders(status);
  }

  // Detalle de un pedido. GET /admin/orders/:id
  @Get('orders/:id')
  getOrder(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  // Reembolsa un pedido pagado. POST /admin/orders/:id/refund
  @Post('orders/:id/refund')
  refund(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.refund(id);
  }

  // Reporte de ventas y costos estimados. GET /admin/reports/sales
  @Get('reports/sales')
  salesReport() {
    return this.service.salesReport();
  }
}
