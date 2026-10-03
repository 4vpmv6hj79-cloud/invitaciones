import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Asignación de un miembro del personal de acceso a una invitación concreta.
// El staff solo puede validar boletos de los eventos que tiene asignados.
@Entity('access_assignments')
@Index(['invitationId', 'userId'], { unique: true })
export class AccessAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'invitation_id', type: 'uuid' })
  invitationId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
