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
import { GuestGroup } from './guest-group.entity';

// Estado de confirmación de asistencia del invitado.
export enum RsvpStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Declined = 'declined',
}

// Modo de confirmación por invitado:
// - Abierto: el invitado elige cuántos asisten (hasta allowedSeats).
// - Cerrado: confirma exactamente allowedSeats (solo acepta o declina).
export enum GuestRsvpMode {
  Abierto = 'abierto',
  Cerrado = 'cerrado',
}

// Datos privados de un invitado. Nunca se exponen públicamente ni a otros invitados.
@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Invitation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitation_id' })
  invitation!: Invitation;

  @Column({ name: 'invitation_id' })
  invitationId!: string;

  // Grupo opcional (familia). Si no tiene, es un invitado individual.
  @ManyToOne(() => GuestGroup, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'group_id' })
  group?: GuestGroup | null;

  @Column({ name: 'group_id', nullable: true })
  groupId?: string | null;

  @Column({ length: 160 })
  name!: string;

  // Contacto opcional (correo o teléfono). Dato personal: se maneja con cuidado.
  @Column({ type: 'varchar', length: 160, nullable: true })
  contact?: string | null;

  // Lugares autorizados para este invitado (incluye acompañantes).
  @Column({ name: 'allowed_seats', type: 'int', default: 1 })
  allowedSeats!: number;

  // Modo de confirmación de este invitado (abierto: elige; cerrado: fijo a allowedSeats).
  @Column({ name: 'rsvp_mode', type: 'enum', enum: GuestRsvpMode, default: GuestRsvpMode.Abierto })
  rsvpMode!: GuestRsvpMode;

  @Column({ name: 'rsvp_status', type: 'enum', enum: RsvpStatus, default: RsvpStatus.Pending })
  rsvpStatus!: RsvpStatus;

  // Lugares efectivamente confirmados (0 si declina).
  @Column({ name: 'confirmed_seats', type: 'int', default: 0 })
  confirmedSeats!: number;

  // Preferencias de alimentos / necesidades especiales (opcional).
  @Column({ name: 'dietary_notes', type: 'text', nullable: true })
  dietaryNotes?: string | null;

  // Token opaco para el enlace privado del invitado (confirmar sin cuenta).
  @Column({ name: 'access_token', type: 'varchar', length: 48, unique: true })
  accessToken!: string;

  // Token único del pase/boleto (QR). Se genera al activar boletos.
  @Column({ name: 'ticket_token', type: 'varchar', length: 48, nullable: true, unique: true })
  ticketToken?: string | null;

  // Momento del registro de entrada. Nulo = aún no ha ingresado. Previene reutilización.
  @Column({ name: 'checked_in_at', type: 'timestamptz', nullable: true })
  checkedInAt?: Date | null;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
