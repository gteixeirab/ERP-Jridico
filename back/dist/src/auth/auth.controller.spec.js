"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
const sessions_service_1 = require("../sessions/sessions.service");
describe('AuthController', () => {
    let controller;
    let authService;
    let configService;
    let sessionsService;
    let mockResponse;
    let mockRequest;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                {
                    provide: auth_service_1.AuthService,
                    useValue: {
                        signIn: jest.fn(),
                        signUp: jest.fn(),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn((key) => {
                            if (key === 'NODE_ENV') {
                                return 'development';
                            }
                            return null;
                        }),
                    },
                },
                {
                    provide: sessions_service_1.SessionsService,
                    useValue: {
                        invalidate: jest.fn(),
                    },
                },
            ],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
        authService = module.get(auth_service_1.AuthService);
        configService = module.get(config_1.ConfigService);
        sessionsService = module.get(sessions_service_1.SessionsService);
        mockResponse = {
            cookie: jest.fn(),
            clearCookie: jest.fn(),
        };
        mockRequest = {
            cookies: { session: 'mockSessionId' },
        };
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('register', () => {
        it('should register a user and return the token and user data', async () => {
            const registerDto = { email: 'test@example.com', password: 'password123', name: 'Test User' };
            const mockToken = 'mockToken';
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            jest.spyOn(authService, 'signUp').mockResolvedValue({
                token: mockToken,
                user: mockUser
            });
            const result = await controller.register(registerDto);
            expect(authService.signUp).toHaveBeenCalledWith(registerDto.email, registerDto.password, registerDto.name);
            expect(result).toEqual({
                token: mockToken,
                message: 'Registro realizado com sucesso',
                user: {
                    email: registerDto.email,
                    name: registerDto.name
                }
            });
        });
    });
    describe('login', () => {
        it('should log in a user and return the token and user data', async () => {
            const authDto = { email: 'test@example.com', password: 'password123' };
            const mockToken = 'mockToken';
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            jest.spyOn(authService, 'signIn').mockResolvedValue({
                token: mockToken,
                user: mockUser
            });
            const result = await controller.login(authDto);
            expect(authService.signIn).toHaveBeenCalledWith(authDto.email, authDto.password);
            expect(result).toEqual({
                token: mockToken,
                message: 'Login realizado com sucesso',
                user: {
                    id: mockUser.id,
                    name: mockUser.name,
                    email: mockUser.email
                }
            });
        });
    });
    describe('logout', () => {
        it('should return a success message', async () => {
            const result = await controller.logout();
            expect(result).toEqual({
                message: 'Logout realizado com sucesso'
            });
        });
    });
});
//# sourceMappingURL=auth.controller.spec.js.map