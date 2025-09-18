import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
    }
    return user;
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @Post('test')
  async createTestUser() {
    const testUser = {
      name: 'Usuário Teste',
      email: 'test@example.com',
      password: 'senha123',
      isActive: true,
    };
    
    try {
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      const user = await this.usersService.create({
        ...testUser,
        password: hashedPassword,
      });
      
      return { message: 'Usuário de teste criado com sucesso', user };
    } catch (error) {
      if (error.code === 'P2002') {
        return { message: 'Usuário de teste já existe' };
      }
      throw error;
    }
  }
}
