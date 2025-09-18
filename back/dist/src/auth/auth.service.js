"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
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
            const { password: userPassword, ...result } = user;
            return result;
        }
        catch (error) {
            console.error('Erro ao validar usuário:', error);
            return null;
        }
    }
    async login(loginDto) {
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
        }
        catch (error) {
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
    async refreshTokens(refreshTokenDto) {
        try {
            if (!refreshTokenDto?.refreshToken) {
                throw new common_1.UnauthorizedException('Refresh token não fornecido');
            }
            const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET', 'seuRefreshTokenSeguroAqui'),
            });
            if (!payload?.sub || !payload?.email) {
                throw new common_1.UnauthorizedException('Token inválido: payload incompleto');
            }
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Usuário não encontrado');
            }
            const isRefreshTokenValid = await bcrypt.compare(refreshTokenDto.refreshToken, user.refreshToken || '');
            if (!isRefreshTokenValid) {
                throw new common_1.UnauthorizedException('Refresh token inválido');
            }
            const tokens = await this.getTokens(payload.sub, payload.email);
            await this.updateRefreshToken(payload.sub, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token inválido');
        }
    }
    async logout(userId) {
        try {
            if (!userId) {
                throw new Error('ID do usuário não fornecido');
            }
            await this.usersService.update(userId, { refreshToken: null });
            return { success: true, message: 'Logout realizado com sucesso' };
        }
        catch (error) {
            console.error('Erro durante o logout:', error);
            return {
                success: false,
                message: 'Ocorreu um erro durante o logout. Por favor, tente novamente.'
            };
        }
    }
    async getTokens(userId, email) {
        if (!userId || !email) {
            throw new Error('ID do usuário e email são obrigatórios para gerar tokens');
        }
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync({
                    sub: userId,
                    userId: userId,
                    email,
                }, {
                    secret: this.configService.get('JWT_SECRET', 'seuSegredoMuitoSeguroAqui'),
                    expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
                }),
                this.jwtService.signAsync({
                    sub: userId,
                    userId: userId,
                    email,
                }, {
                    secret: this.configService.get('JWT_REFRESH_SECRET', 'seuRefreshTokenSeguroAqui'),
                    expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d')
                }),
            ]);
            if (!accessToken || !refreshToken) {
                throw new Error('Falha ao gerar um ou mais tokens');
            }
            return {
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Erro detalhado ao gerar tokens JWT:', error);
            }
            throw new Error('Falha ao processar a autenticação. Por favor, tente novamente.');
        }
    }
    async updateRefreshToken(userId, refreshToken) {
        try {
            if (!userId || !refreshToken) {
                throw new Error('ID do usuário ou refresh token não fornecidos');
            }
            const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
            await this.usersService.update(userId, { refreshToken: hashedRefreshToken });
            return { success: true, message: 'Refresh token atualizado com sucesso' };
        }
        catch (error) {
            console.error('Erro ao atualizar o refresh token:', error);
            return {
                success: false,
                message: 'Falha ao atualizar o refresh token'
            };
        }
    }
    verifyToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET', 'seuSegredoMuitoSeguroAqui'),
            });
        }
        catch (error) {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map