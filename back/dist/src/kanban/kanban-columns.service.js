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
exports.KanbanColumnsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KanbanColumnsService = class KanbanColumnsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createKanbanColumnDto) {
        return this.prisma.kanbanColumn.create({
            data: {
                ...createKanbanColumnDto,
                createdBy: userId,
            },
        });
    }
    async findAll(userId) {
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
    async findOne(userId, id) {
        const column = await this.prisma.kanbanColumn.findUnique({
            where: { id },
            include: {
                tasks: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!column || column.createdBy !== userId) {
            throw new common_1.NotFoundException(`Column with ID "${id}" not found`);
        }
        return column;
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        return this.prisma.kanbanColumn.delete({
            where: { id },
        });
    }
};
exports.KanbanColumnsService = KanbanColumnsService;
exports.KanbanColumnsService = KanbanColumnsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KanbanColumnsService);
//# sourceMappingURL=kanban-columns.service.js.map