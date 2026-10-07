import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
    constructor(users: Repository<User>, jwt: JwtService);
    register(dto: RegisterDto): Promise<AuthResult>;
    login(dto: LoginDto): Promise<AuthResult>;
    findById(id: string): Promise<PublicUser | null>;
    private buildResult;
    private toPublic;
}
