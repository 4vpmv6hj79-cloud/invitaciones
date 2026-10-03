import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Estados del pedido de diseño a medida.
export enum DesignStatus {
  Nueva = 'nueva',
  EnProceso = 'en_proceso',
  Propuesta = 'propuesta',
  Aprobada = 'aprobada',
  Rechazada = 'rechazada',
  // Ajuste solicitado por el cliente DESPUÉS de aprobar y pagar (tiene costo adicional).
  AjusteSolicitado = 'ajuste_solicitado',
}

// Solicitud de diseño por encargo hecha por un cliente (organizador).
@Entity('design_requests')
export class DesignRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Cliente que solicita (User). Separa el pedido de su dueño.
  @Column({ name: 'requester_id', type: 'uuid' })
  requesterId!: string;

  @Column({ length: 160 })
  title!: string;

  @Column({ length: 60 })
  eventType!: string;

  @Column({ length: 60, default: '' })
  style!: string;

  @Column({ type: 'text', default: '' })
  details!: string;

  // Presupuesto estimado del cliente, en texto libre (opcional).
  @Column({ type: 'varchar', length: 120, nullable: true })
  budget?: string | null;

  @Column({ type: 'enum', enum: DesignStatus, default: DesignStatus.Nueva })
  status!: DesignStatus;

  // Precio de la propuesta actual, en centavos de MXN (lo fija el admin). Nulo si aún no hay.
  @Column({ name: 'price_cents', type: 'int', nullable: true })
  priceCents!: number | null;

  // Si la propuesta actual ya fue pagada por el cliente.
  @Column({ default: false })
  paid!: boolean;

  // Control de revisiones: cuántas rondas de cambios ha pedido el cliente y el máximo.
  @Column({ name: 'revisions_used', type: 'int', default: 0 })
  revisionsUsed!: number;

  @Column({ name: 'revision_limit', type: 'int', default: 2 })
  revisionLimit!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
