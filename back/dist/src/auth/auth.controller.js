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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async login(loginDto) {
        this.logger.log(`Login attempt for email: ${loginDto.email}`);
        try {
            const result = await this.authService.login(loginDto);
            return result;
        }
        catch (error) {
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
    async refresh(refreshTokenDto) {
        try {
            if (!refreshTokenDto || !refreshTokenDto.refreshToken) {
                throw new Error('Refresh token não fornecido');
            }
            const result = await this.authService.refreshTokens(refreshTokenDto);
            return result;
        }
        catch (error) {
            this.logger.error('Erro ao renovar token:', error);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Não foi possível renovar o token. Por favor, faça login novamente.');
        }
    }
    async logout(req) {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                try {
                    const payload = this.authService.verifyToken(token);
                    if (payload && payload.sub) {
                        const result = await this.authService.logout(payload.sub);
                        if (!result.success) {
                            this.logger.warn(`Aviso durante o logout do usuário ${payload.sub}: ${result.message}`);
                        }
                        return result;
                    }
                }
                catch (error) {
                    this.logger.warn(`Logout com token inválido: ${error.message}`);
                }
            }
            return { success: true, message: 'Logout realizado com sucesso' };
        }
        catch (error) {
            this.logger.error('Erro durante o logout:', error);
            return {
                success: false,
                message: 'Ocorreu um erro durante o logout. Por favor, tente novamente.'
            };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map