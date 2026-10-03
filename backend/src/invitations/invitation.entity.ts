import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TemplateDefinition } from '../templates/template.entity';
import { Event } from './event.entity';

// Estado de la invitación en su ciclo de vida.
// En la Etapa 2 solo se usa 'draft'; 'published' llega con el pago (Etapa 3).
export enum InvitationStatus {
  Draft = 'draft',
  Published = 'published',
}

// Instancia personalizada: plantilla elegida + contenido del evento + overrides de diseño.
@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Plantilla base (diseño). No se borra la plantilla aunque se use aquí.
  @ManyToOne(() => TemplateDefinition, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'template_id' })
  template!: TemplateDefinition;

  @Column({ name: 'template_id' })
  templateId!: string;

  // Dueño de la invitación (organizador). Clave para la separación de datos entre clientes.
  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId!: string | null;

  // Módulo opcional de boletos QR. Si está activo, los invitados confirmados tienen pase.
  @Column({ name: 'tickets_enabled', default: false })
  ticketsEnabled!: boolean;

  // Contenido del evento (relación 1:1).
  @OneToOne(() => Event, (event) => event.invitation, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column({ name: 'event_id' })
  eventId!: string;

  // Personalización del diseño sobre la plantilla: colores, tipografías, textos.
  // Parte de una copia del theme de la plantilla y el usuario la ajusta.
  @Column({ type: 'jsonb', default: {} })
  customization!: Record<string, unknown>;

  @Column({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.Draft })
  status!: InvitationStatus;

  // Token público opaco del enlace de la invitación publicada (se genera al pagar).
  // No expone el id interno. Nullable mientras es borrador.
  @Column({ name: 'public_token', type: 'varchar', length: 64, nullable: true, unique: true })
  publicToken!: string | null;

  // Vigencia del enlace publicado (política de la Etapa 3).
  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt!: Date | null;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
