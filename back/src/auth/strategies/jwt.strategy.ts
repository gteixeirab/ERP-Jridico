import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'seuSegredoMuitoSeguroAqui',
    });
  }

  async validate(payload: JwtPayload) {
    // Retorna um objeto com userId e email
    // O userId está disponível tanto em payload.sub quanto em payload.userId
    return { 
      userId: payload.sub || payload.userId, 
      email: payload.email 
    };
  }
}
