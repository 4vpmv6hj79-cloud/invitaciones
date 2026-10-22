import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SecurityQuestionLookupDto, SecurityResetDto } from './dto/security-reset.dto';
import { CurrentUser, Public } from './decorators';
import { SECURITY_QUESTIONS } from './security-questions';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  // Solicita el correo de recuperación. Responde siempre 200 con el mismo
  // mensaje, exista o no la cuenta, para no revelar qué correos están registrados.
  @Public()
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.service.forgotPassword(dto.email);
    return {
      ok: true,
      message: 'Si el correo está registrado, enviaremos un enlace para restablecer la contraseña.',
    };
  }

  // Confirma el reseteo con el token recibido por correo y la nueva contraseña.
  @Public()
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.service.resetPassword(dto.token, dto.password);
    return { ok: true, message: 'Tu contraseña se actualizó. Ya puedes iniciar sesión.' };
  }

  // Catálogo de preguntas de seguridad (para registro y recuperación). Público.
  @Public()
  @Get('security-questions')
  securityQuestions() {
    return SECURITY_QUESTIONS;
  }

  // Paso 1 del reset sin correo: obtener la pregunta de seguridad de un correo.
  // Devuelve { questionId: null } si no hay pregunta (sin revelar si existe la cuenta).
  @Public()
  @HttpCode(200)
  @Post('security-question')
  getSecurityQuestion(@Body() dto: SecurityQuestionLookupDto) {
    return this.service.getSecurityQuestion(dto.email);
  }

  // Paso 2 del reset sin correo: restablecer la contraseña con la respuesta.
  @Public()
  @HttpCode(200)
  @Post('security-reset')
  async securityReset(@Body() dto: SecurityResetDto) {
    await this.service.resetWithSecurityAnswer(dto.email, dto.answer, dto.password);
    return { ok: true, message: 'Tu contraseña se actualizó. Ya puedes iniciar sesión.' };
  }

  // Requiere JWT (guard global). Devuelve el usuario actual.
  @Get('me')
  me(@CurrentUser() user: { id: string }) {
    return this.service.findById(user.id);
  }
}
