import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from './user.entity';

// Contenido del token que queda disponible como request.user.
export interface JwtPayload {
  sub: string;
  role: UserRole;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'dev_secret',
    });
  }

  // Lo que retorna aquí se inyecta en request.user.
  validate(payload: JwtPayload) {
    return { id: payload.sub, role: payload.role, email: payload.email };
  }
}
