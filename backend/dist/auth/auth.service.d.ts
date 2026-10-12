import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from './mail.service';
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
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    private readonly config;
    private readonly mail;
    constructor(users: Repository<User>, jwt: JwtService, config: ConfigService, mail: MailService);
    register(dto: RegisterDto): Promise<AuthResult>;
    login(dto: LoginDto): Promise<AuthResult>;
    findById(id: string): Promise<PublicUser | null>;
    forgotPassword(emailRaw: string): Promise<void>;
    resetPassword(rawToken: string, newPassword: string): Promise<void>;
    private hashToken;
    private buildResult;
    private toPublic;
}
