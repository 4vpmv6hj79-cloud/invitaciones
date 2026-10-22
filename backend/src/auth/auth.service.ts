import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from './mail.service';
import { isValidQuestionId, normalizeAnswer } from './security-questions';

// Datos públicos del usuario (sin el hash).
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResult {
  token: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const email = dto.email.toLowerCase().trim();
    const exists = await this.users.findOne({ where: { email } });
    if (exists) {
      throw new ConflictException('Ya existe una cuenta con ese correo');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Pregunta de seguridad (opcional por compatibilidad; validada si viene).
    let securityQuestion: string | null = null;
    let securityAnswerHash: string | null = null;
    if (dto.securityQuestion && dto.securityAnswer) {
      if (!isValidQuestionId(dto.securityQuestion)) {
        throw new BadRequestException('Pregunta de seguridad no válida');
      }
      securityQuestion = dto.securityQuestion;
      securityAnswerHash = await bcrypt.hash(normalizeAnswer(dto.securityAnswer), 10);
    }

    const user = await this.users.save(
      this.users.create({
        email,
        passwordHash,
        name: dto.name,
        role: UserRole.Organizer,
        securityQuestion,
        securityAnswerHash,
      }),
    );
    return this.buildResult(user);
  }

  // Devuelve la pregunta de seguridad asociada a un correo (para el reset sin correo).
  // Respuesta genérica si no existe la cuenta o no tiene pregunta configurada,
  // para no revelar qué correos están registrados.
  async getSecurityQuestion(emailRaw: string): Promise<{ questionId: string | null }> {
    const email = emailRaw.toLowerCase().trim();
    const user = await this.users.findOne({ where: { email } });
    if (!user || !user.securityQuestion) {
      return { questionId: null };
    }
    return { questionId: user.securityQuestion };
  }

  // Restablece la contraseña verificando la respuesta de la pregunta de seguridad.
  async resetWithSecurityAnswer(
    emailRaw: string,
    answer: string,
    newPassword: string,
  ): Promise<void> {
    const email = emailRaw.toLowerCase().trim();
    const user = await this.users.findOne({ where: { email } });
    // Mensaje genérico para no revelar si el correo existe o tiene pregunta.
    if (!user || !user.securityQuestion || !user.securityAnswerHash) {
      throw new BadRequestException('No se pudo verificar la información. Revisa los datos.');
    }
    const ok = await bcrypt.compare(normalizeAnswer(answer), user.securityAnswerHash);
    if (!ok) {
      throw new BadRequestException('La respuesta de seguridad no es correcta.');
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.users.save(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.users.findOne({ where: { email } });
    // Mensaje genérico para no revelar si el correo existe.
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    return this.buildResult(user);
  }

  async findById(id: string): Promise<PublicUser | null> {
    const user = await this.users.findOne({ where: { id } });
    return user ? this.toPublic(user) : null;
  }

  // Inicia la recuperación de contraseña. Genera un token, lo guarda hasheado
  // con 1 hora de vigencia y envía (o prepara) el correo con el enlace.
  // Responde siempre igual, exista o no la cuenta, para no revelar correos.
  async forgotPassword(emailRaw: string): Promise<void> {
    const email = emailRaw.toLowerCase().trim();
    const user = await this.users.findOne({ where: { email } });
    if (!user) {
      return; // respuesta silenciosa (no se revela que el correo no existe)
    }

    // Token en claro para el enlace; en la base solo guardamos su hash.
    const rawToken = randomBytes(32).toString('hex');
    user.resetTokenHash = this.hashToken(rawToken);
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    user.resetTokenExpires = expires;
    await this.users.save(user);

    const frontendUrl =
      this.config.get<string>('FRONTEND_URL')?.trim() || 'http://localhost:4300';
    const resetUrl = `${frontendUrl}/restablecer?token=${rawToken}`;
    await this.mail.sendPasswordReset(email, resetUrl);
  }

  // Confirma el reseteo: valida el token (hash + vigencia) y actualiza la contraseña.
  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    const user = await this.users.findOne({
      where: { resetTokenHash: tokenHash, resetTokenExpires: MoreThan(new Date()) },
    });
    if (!user) {
      throw new BadRequestException('El enlace de recuperación no es válido o ya expiró.');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    // Invalida el token tras usarlo (un solo uso).
    user.resetTokenHash = null;
    user.resetTokenExpires = null;
    await this.users.save(user);
  }

  // Hash del token de reseteo (SHA-256). No reversible; en la base nunca hay token en claro.
  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private buildResult(user: User): AuthResult {
    const payload = { sub: user.id, role: user.role, email: user.email };
    const token = this.jwt.sign(payload);
    return { token, user: this.toPublic(user) };
  }

  private toPublic(user: User): PublicUser {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
