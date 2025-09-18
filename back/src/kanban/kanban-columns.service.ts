import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKanbanColumnDto } from './dto/create-kanban-column.dto';

@Injectable()
export class KanbanColumnsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createKanbanColumnDto: CreateKanbanColumnDto) {
    return this.prisma.kanbanColumn.create({
      data: {
        ...createKanbanColumnDto,
        createdBy: userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.kanbanColumn.findMany({
      where: { createdBy: userId },
      include: {
        tasks: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const column = await this.prisma.kanbanColumn.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!column || column.createdBy !== userId) {
      throw new NotFoundException(`Column with ID "${id}" not found`);
    }

    return column;
  }

  async remove(userId: string, id: string) {
    // Verifica se a coluna existe e pertence ao usuário
    await this.findOne(userId, id);

    // Remove a coluna e suas tarefas relacionadas
    return this.prisma.kanbanColumn.delete({
      where: { id },
    });
  }
}
