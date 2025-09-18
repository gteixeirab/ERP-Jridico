import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async findByEmail(email: string) {
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

  // This method is for internal use by the AuthService
  async findById(id: string) {
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

  // This method is for internal use by the AuthService
  async findByEmailForAuth(email: string) {
    console.log(`DEBUG: UsersService - Buscando usuário por email: ${email}`); // DEBUG
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
      console.log(`DEBUG: UsersService - Usuário encontrado: ${user.email}`); // DEBUG
    } else {
      console.log(`DEBUG: UsersService - Usuário com email ${email} NÃO encontrado.`); // DEBUG
    }
    return user;
  }

  // This method is for internal use by the AuthService
  async findByIdForAuth(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      // Handle cases where the user to update is not found
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    // Prisma's update will throw an error if the user doesn't exist, 
    // so we don't need a separate findOne check.
    try {
      const deactivatedUser = await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = deactivatedUser;
      return result;
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}