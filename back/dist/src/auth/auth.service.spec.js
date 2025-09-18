"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
jest.mock('bcrypt', () => ({
    hash: jest.fn((password) => Promise.resolve(`hashed-${password}`)),
    compare: jest.fn((password, hash) => Promise.resolve(password === hash.replace('hashed-', ''))),
}));
describe('AuthService', () => {
    let service;
    let prismaService;
    let jwtService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        sign: jest.fn(() => 'mockAccessToken'),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        prismaService = module.get(prisma_service_1.PrismaService);
        jwtService = module.get(jwt_1.JwtService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('hashPassword', () => {
        it('should hash a password', async () => {
            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
            expect(hashedPassword).toBe(`hashed-${password}`);
        });
    });
    describe('validatePassword', () => {
        it('should validate a password successfully', async () => {
            const password = 'password123';
            const storedHash = 'hashed-password123';
            const isValid = await bcrypt.compare(password, storedHash);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, storedHash);
            expect(isValid).toBe(true);
        });
        it('should invalidate a password', async () => {
            const password = 'wrongpassword';
            const storedHash = 'hashed-password123';
            const isValid = await bcrypt.compare(password, storedHash);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, storedHash);
            expect(isValid).toBe(false);
        });
    });
    describe('generateJwtToken', () => {
        it('should generate a JWT token', async () => {
            const userId = 'someUserId';
            const token = jwtService.sign({ sub: userId });
            expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId });
            expect(token).toBe('mockAccessToken');
        });
    });
    describe('signUp', () => {
        const authDto = { email: 'new@example.com', password: 'password123' };
        it('should successfully sign up a new user', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
            jest.spyOn(prismaService.user, 'create').mockResolvedValue({
                id: 'newUserId',
                email: authDto.email,
                password: `hashed-${authDto.password}`,
                name: 'new',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const result = await service.signUp(authDto.email, authDto.password, 'new');
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: authDto.email } });
            expect(bcrypt.hash).toHaveBeenCalledWith(authDto.password, 10);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: authDto.email,
                    password: `hashed-${authDto.password}`,
                    name: 'new',
                },
            });
            expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'newUserId' });
            expect(result).toEqual({
                token: 'mockAccessToken',
                user: {
                    id: 'newUserId',
                    email: authDto.email,
                    name: 'new',
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                }
            });
        });
        it('should throw BadRequestException if email is already registered', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
                id: 'existingUserId',
                email: authDto.email,
                password: 'hashed-password123',
                name: 'existing',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await expect(service.signUp(authDto.email, authDto.password, 'existing')).rejects.toThrow(common_1.ConflictException);
            await expect(service.signUp(authDto.email, authDto.password, 'existing')).rejects.toThrow('Este email já está em uso');
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: authDto.email } });
            expect(prismaService.user.create).not.toHaveBeenCalled();
        });
    });
    describe('signIn', () => {
        const authDto = { email: 'test@example.com', password: 'password123' };
        const user = {
            id: 'testUserId',
            email: authDto.email,
            password: `hashed-${authDto.password}`,
            name: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        it('should successfully sign in an existing user', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
            bcrypt.compare.mockResolvedValueOnce(true);
            const result = await service.signIn(authDto.email, authDto.password);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: authDto.email } });
            expect(bcrypt.compare).toHaveBeenCalledWith(authDto.password, user.password);
            expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'testUserId' });
            expect(result).toEqual({
                token: 'mockAccessToken',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        });
        it('should throw UnauthorizedException if user not found', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
            await expect(service.signIn(authDto.email, authDto.password)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.signIn(authDto.email, authDto.password)).rejects.toThrow('Email ou senha inválidos');
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: authDto.email } });
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });
        it('should throw UnauthorizedException if password is invalid', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
            bcrypt.compare.mockResolvedValueOnce(false);
            await expect(service.signIn(authDto.email, authDto.password)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.signIn(authDto.email, authDto.password)).rejects.toThrow('Email ou senha inválidos');
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: authDto.email } });
            expect(bcrypt.compare).toHaveBeenCalledWith(authDto.password, user.password);
            expect(jwtService.sign).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map