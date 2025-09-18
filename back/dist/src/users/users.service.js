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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });
        const { password, ...result } = user;
        return result;
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findById(id) {
        console.log(`DEBUG: UsersService - Buscando usuário por ID: ${id}`);
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                refreshToken: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            console.log(`DEBUG: UsersService - Usuário com ID ${id} NÃO encontrado.`);
            return null;
        }
        console.log(`DEBUG: UsersService - Usuário encontrado: ${user.email}`);
        return user;
    }
    async findByEmailForAuth(email) {
        console.log(`DEBUG: UsersService - Buscando usuário por email: ${email}`);
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                refreshToken: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (user) {
            console.log(`DEBUG: UsersService - Usuário encontrado: ${user.email}`);
        }
        else {
            console.log(`DEBUG: UsersService - Usuário com email ${email} NÃO encontrado.`);
        }
        return user;
    }
    async findByIdForAuth(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const data = { ...updateUserDto };
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data,
            });
            const { password, ...result } = updatedUser;
            return result;
        }
        catch (error) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
    }
    async remove(id) {
        try {
            const deactivatedUser = await this.prisma.user.update({
                where: { id },
                data: { isActive: false },
            });
            const { password, ...result } = deactivatedUser;
            return result;
        }
        catch (error) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map