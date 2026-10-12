import { IsString, MaxLength, MinLength } from 'class-validator';

// Confirmación del reseteo: token recibido por correo + nueva contraseña.
export class ResetPasswordDto {
  @IsString()
  @MinLength(10)
  token!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72) // límite de bcrypt
  password!: string;
}
