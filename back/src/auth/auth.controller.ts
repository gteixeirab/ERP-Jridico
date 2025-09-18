import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto, RefreshTokenDto, LogoutResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      this.logger.error(`Login error for email ${loginDto.email}:`, error);
      return {
        success: false,
        message: 'Erro ao processar a requisição de login',
        accessToken: null,
        refreshToken: null,
        user: null
      };
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      if (!refreshTokenDto || !refreshTokenDto.refreshToken) {
        throw new Error('Refresh token não fornecido');
      }
      
      const result = await this.authService.refreshTokens(refreshTokenDto);
      return result;
    } catch (error) {
      this.logger.error('Erro ao renovar token:', error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Não foi possível renovar o token. Por favor, faça login novamente.');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req): Promise<LogoutResponseDto> {
    try {
      // Tenta obter o token do cabeçalho de autorização
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' do início
        
        try {
          // Verifica o token manualmente
          const payload = this.authService.verifyToken(token);
          if (payload && payload.sub) {
            const result = await this.authService.logout(payload.sub);
            if (!result.success) {
              this.logger.warn(`Aviso durante o logout do usuário ${payload.sub}: ${result.message}`);
            }
            return result;
          }
        } catch (error) {
          // Se o token for inválido ou expirado, apenas registra o aviso e continua
          this.logger.warn(`Logout com token inválido: ${error.message}`);
        }
      }
      
      // Retorna sucesso mesmo se não houver token válido
      return { success: true, message: 'Logout realizado com sucesso' };
    } catch (error) {
      this.logger.error('Erro durante o logout:', error);
      return { 
        success: false, 
        message: 'Ocorreu um erro durante o logout. Por favor, tente novamente.' 
      };
    }
  }
}
