import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    register(dto: RegisterDto): Promise<import("./auth.service").AuthResult>;
    login(dto: LoginDto): Promise<import("./auth.service").AuthResult>;
    me(user: {
        id: string;
    }): Promise<import("./auth.service").PublicUser | null>;
}
