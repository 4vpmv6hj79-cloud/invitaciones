import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventType } from '../templates/template.enums';
import { Invitation } from './invitation.entity';

// Contenido del evento, independiente del diseño de la plantilla.
// Reutilizable entre formatos (web, imagen, pdf...) en etapas posteriores.
@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: EventType })
  type!: EventType;

  @Column({ length: 160, default: '' })
  title!: string;

  // Datos del contenido: nombres, mensaje, fecha, hora, zona horaria, etc.
  // Estructura flexible para no acoplar el esquema a un tipo de evento concreto.
  @Column({ type: 'jsonb', default: {} })
  data!: Record<string, unknown>;

  @OneToOne(() => Invitation, (invitation) => invitation.event)
  invitation?: Invitation;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
