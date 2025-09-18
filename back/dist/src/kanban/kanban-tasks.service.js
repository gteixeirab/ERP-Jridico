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
exports.KanbanTasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KanbanTasksService = class KanbanTasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createKanbanTaskDto) {
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
            const column = await this.prisma.kanbanColumn.findUnique({
                where: { id: createKanbanTaskDto.columnId },
                select: { id: true }
            });
            if (!column) {
                console.error(`Coluna não encontrada: ${createKanbanTaskDto.columnId}`);
                throw new common_1.NotFoundException(`Coluna não encontrada`);
            }
            const lastTask = await this.prisma.kanbanTask.findFirst({
                where: { columnId: createKanbanTaskDto.columnId },
                orderBy: { sortOrder: "desc" },
                select: { sortOrder: true },
            });
            const newSortOrder = (lastTask?.sortOrder || 0) + 1;
            const tagsAsString = createKanbanTaskDto.tags
                ? createKanbanTaskDto.tags.join(",")
                : "";
            const taskData = {
                title: createKanbanTaskDto.title,
                description: "",
                tags: tagsAsString,
                columnId: createKanbanTaskDto.columnId,
                sortOrder: newSortOrder,
                createdBy: userId,
                priority: "media",
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
        }
        catch (error) {
            console.error("Erro ao criar tarefa:", error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error("Ocorreu um erro ao criar a tarefa. Por favor, tente novamente.");
        }
    }
    async findAll(userId, columnId) {
        const where = { createdBy: userId };
        if (columnId) {
            where.columnId = columnId;
        }
        return this.prisma.kanbanTask.findMany({
            where,
            orderBy: [{ columnId: "asc" }, { sortOrder: "asc" }],
        });
    }
    async findOne(userId, id) {
        const task = await this.prisma.kanbanTask.findUnique({
            where: { id },
        });
        if (!task || task.createdBy !== userId) {
            throw new common_1.NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }
    async update(userId, id, updateData) {
        await this.findOne(userId, id);
        const updatePayload = {
            title: updateData.title,
            description: updateData.description !== undefined ? updateData.description : null,
            tags: updateData.tags !== undefined ? updateData.tags : undefined,
            priority: updateData.priority,
            assignedTo: updateData.assignedTo !== undefined ? updateData.assignedTo : null,
            dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null,
        };
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
    async remove(userId, id) {
        await this.findOne(userId, id);
        return this.prisma.kanbanTask.delete({
            where: { id },
        });
    }
    async moveTask(userId, taskId, targetColumnId, newPosition) {
        const task = await this.findOne(userId, taskId);
        const targetColumn = await this.prisma.kanbanColumn.findUnique({
            where: { id: targetColumnId },
        });
        if (!targetColumn || targetColumn.createdBy !== userId) {
            throw new common_1.NotFoundException(`Target column with ID "${targetColumnId}" not found`);
        }
        return this.prisma.$transaction(async (prisma) => {
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
            await prisma.kanbanTask.updateMany({
                where: {
                    columnId: targetColumnId,
                    sortOrder: { gte: newPosition },
                },
                data: {
                    sortOrder: { increment: 1 },
                },
            });
            return prisma.kanbanTask.update({
                where: { id: taskId },
                data: {
                    columnId: targetColumnId,
                    sortOrder: newPosition,
                },
            });
        });
    }
};
exports.KanbanTasksService = KanbanTasksService;
exports.KanbanTasksService = KanbanTasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KanbanTasksService);
//# sourceMappingURL=kanban-tasks.service.js.map