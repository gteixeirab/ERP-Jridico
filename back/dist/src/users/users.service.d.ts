import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        refreshToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        refreshToken: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmailForAuth(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        refreshToken: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByIdForAuth(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        refreshToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        refreshToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        refreshToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
