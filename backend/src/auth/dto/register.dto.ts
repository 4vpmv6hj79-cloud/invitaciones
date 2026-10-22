import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Correo no válido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72) // límite de bcrypt
  password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  // Pregunta de seguridad elegida (id del catálogo) y su respuesta.
  // Opcionales por compatibilidad; el registro nuevo las solicita.
  @IsOptional()
  @IsString()
  @MaxLength(40)
  securityQuestion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  securityAnswer?: string;
}
