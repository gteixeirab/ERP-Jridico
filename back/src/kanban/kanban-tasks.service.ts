import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateKanbanTaskDto } from "./dto/create-kanban-task.dto";

@Injectable()
export class KanbanTasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createKanbanTaskDto: CreateKanbanTaskDto) {
    try {
      console.log("=== INÍCIO DA CRIAÇÃO DE TAREFA ===");
      console.log("Dados recebidos:", {
        userId,
        typeOfUserId: typeof userId,
        createKanbanTaskDto,
      });

      if (!userId) {
        throw new Error('ID do usuário não fornecido');
      }

      // Verifica se a coluna existe
      const column = await this.prisma.kanbanColumn.findUnique({
        where: { id: createKanbanTaskDto.columnId },
        select: { id: true } // Apenas precisamos do ID para verificar a existência
      });

      if (!column) {
        console.error(`Coluna não encontrada: ${createKanbanTaskDto.columnId}`);
        throw new NotFoundException(
          `Coluna não encontrada`
        );
      }

      // Pega a maior ordem atual para definir a nova ordem
      const lastTask = await this.prisma.kanbanTask.findFirst({
        where: { columnId: createKanbanTaskDto.columnId },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });

      const newSortOrder = (lastTask?.sortOrder || 0) + 1;

      // Converte o array de tags para string separada por vírgula
      const tagsAsString = createKanbanTaskDto.tags
        ? createKanbanTaskDto.tags.join(",")
        : "";

      // Cria o objeto de dados para a nova tarefa
      const taskData = {
        title: createKanbanTaskDto.title,
        description: "", // Campo vazio por enquanto
        tags: tagsAsString,
        columnId: createKanbanTaskDto.columnId,
        sortOrder: newSortOrder,
        createdBy: userId,
        priority: "media", // Valor padrão
      };

      console.log("Dados da tarefa a serem salvos:", {
        ...taskData,
        createdBy: userId,
        createdByType: typeof userId
      });

      const createdTask = await this.prisma.kanbanTask.create({
        data: taskData,
      });

      console.log("Tarefa criada com sucesso:", createdTask.id);
      return createdTask;
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error(
        "Ocorreu um erro ao criar a tarefa. Por favor, tente novamente."
      );
    }
  }

  async findAll(userId: string, columnId?: string) {
    const where: any = { createdBy: userId };
    if (columnId) {
      where.columnId = columnId;
    }

    return this.prisma.kanbanTask.findMany({
      where,
      orderBy: [{ columnId: "asc" }, { sortOrder: "asc" }],
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.kanbanTask.findUnique({
      where: { id },
    });

    if (!task || task.createdBy !== userId) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(userId: string, id: string, updateData: any) {
    // Verifica se a tarefa existe e pertence ao usuário
    await this.findOne(userId, id);

    // Prepara os dados para atualização
    const updatePayload: any = {
      title: updateData.title,
      description:
        updateData.description !== undefined ? updateData.description : null,
      tags: updateData.tags !== undefined ? updateData.tags : undefined,
      priority: updateData.priority,
      assignedTo:
        updateData.assignedTo !== undefined ? updateData.assignedTo : null,
      dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null,
    };

    // Remove campos undefined
    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key] === undefined) {
        delete updatePayload[key];
      }
    });

    return this.prisma.kanbanTask.update({
      where: { id },
      data: updatePayload,
    });
  }

  async remove(userId: string, id: string) {
    // Verifica se a tarefa existe e pertence ao usuário
    await this.findOne(userId, id);

    return this.prisma.kanbanTask.delete({
      where: { id },
    });
  }

  async moveTask(
    userId: string,
    taskId: string,
    targetColumnId: string,
    newPosition: number
  ) {
    const task = await this.findOne(userId, taskId);

    // Verifica se a coluna de destino existe e pertence ao usuário
    const targetColumn = await this.prisma.kanbanColumn.findUnique({
      where: { id: targetColumnId },
    });

    if (!targetColumn || targetColumn.createdBy !== userId) {
      throw new NotFoundException(
        `Target column with ID "${targetColumnId}" not found`
      );
    }

    // Inicia uma transação para garantir a consistência
    return this.prisma.$transaction(async (prisma) => {
      // Atualiza a ordem das tarefas na coluna de origem
      if (task.columnId !== targetColumnId) {
        await prisma.kanbanTask.updateMany({
          where: {
            columnId: task.columnId,
            sortOrder: { gt: task.sortOrder },
          },
          data: {
            sortOrder: { decrement: 1 },
          },
        });
      }

      // Atualiza a ordem das tarefas na coluna de destino
      await prisma.kanbanTask.updateMany({
        where: {
          columnId: targetColumnId,
          sortOrder: { gte: newPosition },
        },
        data: {
          sortOrder: { increment: 1 },
        },
      });

      // Move a tarefa para a nova posição
      return prisma.kanbanTask.update({
        where: { id: taskId },
        data: {
          columnId: targetColumnId,
          sortOrder: newPosition,
        },
      });
    });
  }
}
