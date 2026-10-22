import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

// Paso 1: pedir la pregunta de seguridad asociada a un correo.
export class SecurityQuestionLookupDto {
  @IsEmail({}, { message: 'Correo no válido' })
  email!: string;
}

// Paso 2: restablecer la contraseña respondiendo la pregunta de seguridad.
export class SecurityResetDto {
  @IsEmail({}, { message: 'Correo no válido' })
  email!: string;

  @IsString()
  @MaxLength(120)
  answer!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72)
  password!: string;
}
