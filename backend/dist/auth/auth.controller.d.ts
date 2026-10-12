import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    register(dto: RegisterDto): Promise<import("./auth.service").AuthResult>;
    login(dto: LoginDto): Promise<import("./auth.service").AuthResult>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        ok: boolean;
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        ok: boolean;
        message: string;
    }>;
    me(user: {
        id: string;
    }): Promise<import("./auth.service").PublicUser | null>;
}
