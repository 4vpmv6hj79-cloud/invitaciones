import { IsEmail } from 'class-validator';

// Solicitud de recuperación: solo el correo.
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Correo no válido' })
  email!: string;
}
