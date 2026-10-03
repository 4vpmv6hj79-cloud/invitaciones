import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invitation } from '../invitations/invitation.entity';

// Grupo o familia de invitados, con un cupo de lugares compartido.
@Entity('guest_groups')
export class GuestGroup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Invitation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitation_id' })
  invitation!: Invitation;

  @Column({ name: 'invitation_id' })
  invitationId!: string;

  @Column({ length: 160 })
  name!: string;

  @Column({ name: 'allowed_seats', type: 'int', default: 1 })
  allowedSeats!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
