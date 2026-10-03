import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invitation } from '../invitations/invitation.entity';

// Estado del pedido/pago.
export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Refunded = 'refunded',
  Canceled = 'canceled',
}

// Proveedor de pago usado para el pedido.
export enum PaymentProvider {
  Stripe = 'stripe',
  Simulated = 'simulated', // modo desarrollo sin claves de Stripe
}

// Qué se está pagando con este pedido.
export enum OrderKind {
  InvitationPublish = 'invitation_publish', // publicar una invitación
  DesignService = 'design_service', // diseño a medida
}

// Pedido/transacción comercial. Puede apuntar a una invitación (publicación)
// o a una solicitud de diseño a medida, según el 'kind'.
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: OrderKind, default: OrderKind.InvitationPublish })
  kind!: OrderKind;

  // Invitación asociada (solo para kind=invitation_publish).
  @ManyToOne(() => Invitation, { eager: true, onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'invitation_id' })
  invitation!: Invitation | null;

  @Column({ name: 'invitation_id', nullable: true })
  invitationId!: string | null;

  // Solicitud de diseño asociada (solo para kind=design_service).
  @Column({ name: 'design_request_id', type: 'uuid', nullable: true })
  designRequestId!: string | null;

  // Monto en la unidad menor (centavos) para evitar errores de redondeo.
  @Column({ type: 'int' })
  amount!: number;

  @Column({ type: 'varchar', length: 3, default: 'MXN' })
  currency!: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status!: OrderStatus;

  @Column({ type: 'enum', enum: PaymentProvider })
  provider!: PaymentProvider;

  // Referencia del proveedor (id de la sesión de Checkout o del PaymentIntent).
  @Column({ name: 'payment_ref', type: 'varchar', nullable: true })
  paymentRef!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
