import { Injectable, UnauthorizedException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, AuthResponseDto, RefreshTokenDto, TokensResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmailForAuth(email);
      
      if (!user) {
        console.log(`DEBUG: AuthService - validateUser: Usuário com email ${email} NÃO encontrado.`);
        return null;
      }

      console.log(`DEBUG: AuthService - validateUser: Usuário encontrado. Comparando senhas para ${email}.`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`DEBUG: AuthService - validateUser: Resultado da comparação de senha para ${email}: ${isPasswordValid}`);

      if (!isPasswordValid) {
        return null;
      }
      
      const { password: userPassword, ...result } = user; // Desestruturar para remover a senha
      return result;
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        return {
          success: false,
          message: 'Usuário não encontrado ou senha incorreta',
          accessToken: null,
          refreshToken: null,
          user: null
        };
      }
      
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        success: true,
        message: 'Login realizado com sucesso',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Erro durante o login:', error);
      return {
        success: false,
        message: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
        accessToken: null,
        refreshToken: null,
        user: null
      };
    }
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokensResponseDto> {
    try {
      // Verifica se o refresh token foi fornecido
      if (!refreshTokenDto?.refreshToken) {
        throw new UnauthorizedException('Refresh token não fornecido');
      }

      // Verifica se o token é válido e obtém o payload
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'seuRefreshTokenSeguroAqui'),
        },
      );

      if (!payload?.sub || !payload?.email) {
        throw new UnauthorizedException('Token inválido: payload incompleto');
      }

      // Obtém o usuário para verificar se o token ainda é válido
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Verifica se o refresh token fornecido é o mesmo armazenado no banco de dados
      const isRefreshTokenValid = await bcrypt.compare(
        refreshTokenDto.refreshToken,
        user.refreshToken || '',
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Gera novos tokens
      const tokens = await this.getTokens(payload.sub, payload.email);
      await this.updateRefreshToken(payload.sub, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async logout(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!userId) {
        throw new Error('ID do usuário não fornecido');
      }

      await this.usersService.update(userId, { refreshToken: null } as any);
      return { success: true, message: 'Logout realizado com sucesso' };
    } catch (error) {
      console.error('Erro durante o logout:', error);
      return { 
        success: false, 
        message: 'Ocorreu um erro durante o logout. Por favor, tente novamente.' 
      };
    }
  }

  private async getTokens(userId: string, email: string): Promise<TokensResponseDto> {
    if (!userId || !email) {
      throw new Error('ID do usuário e email são obrigatórios para gerar tokens');
    }

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            userId: userId, // Adicionando explicitamente o userId ao payload
            email,
          },
          {
            secret: this.configService.get<string>('JWT_SECRET', 'seuSegredoMuitoSeguroAqui'),
            expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            userId: userId, // Adicionando explicitamente o userId ao payload
            email,
          },
          {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'seuRefreshTokenSeguroAqui'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d')
          },
        ),
      ]);

      if (!accessToken || !refreshToken) {
        throw new Error('Falha ao gerar um ou mais tokens');
      }

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // Log detalhado apenas em ambiente de desenvolvimento
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro detalhado ao gerar tokens JWT:', error);
      }
      
      // Lança um erro genérico sem expor detalhes internos
      throw new Error('Falha ao processar a autenticação. Por favor, tente novamente.');
    }
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!userId || !refreshToken) {
        throw new Error('ID do usuário ou refresh token não fornecidos');
      }
      
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.usersService.update(userId, { refreshToken: hashedRefreshToken } as any);
      
      return { success: true, message: 'Refresh token atualizado com sucesso' };
    } catch (error) {
      console.error('Erro ao atualizar o refresh token:', error);
      return { 
        success: false, 
        message: 'Falha ao atualizar o refresh token' 
      };
    }
  }

  /**
   * Verifica um token JWT manualmente
   * @param token Token JWT a ser verificado
   * @returns Payload do token se for válido
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET', 'seuSegredoMuitoSeguroAqui'),
      });
    } catch (error) {
      // Se o token for inválido ou expirado, retorna null
      return null;
    }
  }
}
