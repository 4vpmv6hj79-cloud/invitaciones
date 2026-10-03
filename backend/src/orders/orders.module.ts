import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Invitation } from '../invitations/invitation.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { InvitationsModule } from '../invitations/invitations.module';
import { DesignModule } from '../design/design.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Invitation]),
    InvitationsModule,
    DesignModule,
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
