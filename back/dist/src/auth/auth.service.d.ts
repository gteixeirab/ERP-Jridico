import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, AuthResponseDto, RefreshTokenDto, TokensResponseDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokensResponseDto>;
    logout(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private getTokens;
    private updateRefreshToken;
    verifyToken(token: string): JwtPayload | null;
}
