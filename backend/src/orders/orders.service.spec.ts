import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, OrderStatus, PaymentProvider } from './order.entity';
import { Invitation } from '../invitations/invitation.entity';
import { InvitationsService } from '../invitations/invitations.service';
import { DesignService } from '../design/design.service';

describe('OrdersService', () => {
  let service: OrdersService;

  const ordersRepo = {
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve({ id: 'ord-1', ...x })),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  const invitationsRepo = {
    findOne: jest.fn(),
  };
  const invitationsService = {
    publish: jest.fn().mockResolvedValue({}),
  };
  const designService = {
    getPayable: jest.fn(),
    markApprovedPaid: jest.fn().mockResolvedValue({}),
  };
  // Sin STRIPE_SECRET_KEY => modo simulado.
  const config = {
    get: jest.fn((key: string) => {
      const map: Record<string, string> = {
        PUBLISH_PRICE_CENTS: '19900',
        PUBLISH_VALIDITY_DAYS: '180',
        FRONTEND_URL: 'http://localhost:4300',
      };
      return map[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: ordersRepo },
        { provide: getRepositoryToken(Invitation), useValue: invitationsRepo },
        { provide: InvitationsService, useValue: invitationsService },
        { provide: DesignService, useValue: designService },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('opera en modo simulado cuando no hay clave de Stripe', () => {
    expect(service.isStripeEnabled).toBe(false);
  });

  it('en modo simulado confirma el pago y publica la invitación', async () => {
    invitationsRepo.findOne.mockResolvedValueOnce({ id: 'inv-1' });
    // Pedido pendiente que luego se consulta en confirmPaid.
    ordersRepo.findOne.mockResolvedValueOnce({
      id: 'ord-1',
      invitationId: 'inv-1',
      status: OrderStatus.Pending,
    });

    const result = await service.createCheckout('inv-1', 'owner-1');

    expect(result.simulated).toBe(true);
    expect(result.checkoutUrl).toBeNull();
    expect(ordersRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ provider: PaymentProvider.Simulated, amount: 19900 }),
    );
    expect(invitationsService.publish).toHaveBeenCalledWith('inv-1', 180);
  });

  it('confirmPaid es idempotente: no republica un pedido ya pagado', async () => {
    ordersRepo.findOne.mockResolvedValueOnce({
      id: 'ord-1',
      invitationId: 'inv-1',
      status: OrderStatus.Paid,
    });
    await service.confirmPaid('ord-1', 'ref');
    expect(invitationsService.publish).not.toHaveBeenCalled();
  });

  it('lanza 404 si la invitación no existe al crear checkout', async () => {
    invitationsRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.createCheckout('x', 'owner-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('checkout de diseño en modo simulado aprueba la solicitud', async () => {
    designService.getPayable.mockResolvedValueOnce({ id: 'dr-1', priceCents: 250000 });
    ordersRepo.findOne.mockResolvedValueOnce({
      id: 'ord-1',
      kind: 'design_service',
      designRequestId: 'dr-1',
      status: OrderStatus.Pending,
    });
    const result = await service.createDesignCheckout('dr-1', 'u1');
    expect(result.simulated).toBe(true);
    expect(designService.markApprovedPaid).toHaveBeenCalledWith('dr-1');
  });

  it('reembolso en modo simulado marca refunded', async () => {
    ordersRepo.findOne.mockResolvedValueOnce({
      id: 'ord-1',
      status: OrderStatus.Paid,
      provider: PaymentProvider.Simulated,
      paymentRef: 'simulated',
    });
    const result = await service.refund('ord-1');
    expect(result.status).toBe(OrderStatus.Refunded);
  });

  it('reembolso es idempotente si ya está refunded', async () => {
    ordersRepo.findOne.mockResolvedValueOnce({ id: 'ord-1', status: OrderStatus.Refunded });
    const result = await service.refund('ord-1');
    expect(result.status).toBe(OrderStatus.Refunded);
    expect(ordersRepo.save).not.toHaveBeenCalled();
  });

  it('no reembolsa un pedido no pagado', async () => {
    ordersRepo.findOne.mockResolvedValueOnce({ id: 'ord-1', status: OrderStatus.Pending });
    await expect(service.refund('ord-1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reporte de ventas suma ingresos pagados y estima comisión', async () => {
    ordersRepo.find.mockResolvedValueOnce([
      { status: OrderStatus.Paid, amount: 19900 },
      { status: OrderStatus.Paid, amount: 19900 },
      { status: OrderStatus.Pending, amount: 19900 },
      { status: OrderStatus.Refunded, amount: 19900 },
    ]);
    const r = await service.salesReport();
    expect(r.totalOrders).toBe(4);
    expect(r.paidOrders).toBe(2);
    expect(r.grossRevenueCents).toBe(39800);
    expect(r.estimatedFeesCents).toBeGreaterThan(0);
    expect(r.estimatedNetCents).toBe(r.grossRevenueCents - r.estimatedFeesCents);
    expect(r.byStatus['paid']).toBe(2);
  });
});
