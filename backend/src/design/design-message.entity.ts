import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DesignRequest } from './design-request.entity';

// Mensaje dentro del hilo de una solicitud de diseño.
// isProposal distingue una propuesta del negocio de un comentario normal.
@Entity('design_messages')
export class DesignMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => DesignRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_id' })
  request!: DesignRequest;

  @Column({ name: 'request_id', type: 'uuid' })
  requestId!: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  // Rol de quien escribe: 'client' o 'admin'. Para pintar el hilo.
  @Column({ name: 'author_role', length: 20 })
  authorRole!: string;

  @Column({ type: 'text' })
  body!: string;

  // true = propuesta del negocio (admin); false = comentario.
  @Column({ name: 'is_proposal', default: false })
  isProposal!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
