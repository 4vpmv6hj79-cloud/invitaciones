import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Correo no válido' })
  email!: string;

  @IsString()
  password!: string;
}
