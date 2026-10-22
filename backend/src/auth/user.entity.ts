import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Roles de usuario con cuenta. El invitado NO tiene cuenta (usa enlace tokenizado).
export enum UserRole {
  Organizer = 'organizer',
  Admin = 'admin',
  // Personal de acceso: valida boletos en los eventos que le asignen.
  Staff = 'staff',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  // Hash bcrypt. Nunca se devuelve al cliente.
  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Organizer })
  role!: UserRole;

  // --- Recuperación de contraseña ---
  // Hash del token de reseteo (nunca se guarda el token en claro). Nulo si no hay reseteo activo.
  @Column({ name: 'reset_token_hash', type: 'varchar', length: 128, nullable: true })
  resetTokenHash?: string | null;

  // Expiración del token de reseteo. Nulo si no hay reseteo activo.
  @Column({ name: 'reset_token_expires', type: 'timestamptz', nullable: true })
  resetTokenExpires?: Date | null;

  // --- Pregunta de seguridad (recuperación sin correo) ---
  // Identificador de la pregunta elegida por el usuario (ej. 'pet', 'city').
  @Column({ name: 'security_question', type: 'varchar', length: 40, nullable: true })
  securityQuestion?: string | null;

  // Hash bcrypt de la respuesta (normalizada). Nunca se guarda en claro.
  @Column({ name: 'security_answer_hash', type: 'varchar', length: 100, nullable: true })
  securityAnswerHash?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
