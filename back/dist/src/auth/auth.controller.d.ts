import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto, RefreshTokenDto, LogoutResponseDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<import("./dto/auth.dto").TokensResponseDto>;
    logout(req: any): Promise<LogoutResponseDto>;
}
