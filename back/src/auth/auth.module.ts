import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // Re-import PassportModule
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy'; // Re-import JwtStrategy

@Module({
  imports: [
    UsersModule,
    PassportModule, // Import PassportModule without defaultStrategy
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'seuSegredoMuitoSeguroAqui'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '15m'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Re-add JwtStrategy to providers
  exports: [JwtStrategy, PassportModule, JwtModule], // Re-add JwtStrategy and PassportModule to exports
})
export class AuthModule {}