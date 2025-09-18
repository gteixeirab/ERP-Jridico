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
exports.KanbanInitService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KanbanInitService = class KanbanInitService {
    constructor(prisma) {
        this.prisma = prisma;
        this.DEFAULT_COLUMNS = [
            { title: 'A Fazer', columnType: 'PENDENTE', sortOrder: 1 },
            { title: 'Em Andamento', columnType: 'EM_ANDAMENTO', sortOrder: 2 },
            { title: 'Concluído', columnType: 'CONCLUIDA', sortOrder: 3 },
            { title: 'Aguardando', columnType: 'PENDENTE', sortOrder: 0 },
        ];
    }
    async onModuleInit() {
        await this.initializeDefaultColumns();
    }
    async initializeDefaultColumns() {
        try {
            const existingColumns = await this.prisma.kanbanColumn.findMany();
            if (existingColumns.length === 0) {
                console.log('Criando colunas padrão do Kanban...');
                const users = await this.prisma.user.findMany();
                for (const user of users) {
                    for (const column of this.DEFAULT_COLUMNS) {
                        await this.prisma.kanbanColumn.create({
                            data: {
                                ...column,
                                createdBy: user.id,
                            },
                        });
                    }
                }
                console.log('Colunas padrão do Kanban criadas com sucesso!');
            }
        }
        catch (error) {
            console.error('Erro ao inicializar colunas padrão do Kanban:', error);
        }
    }
};
exports.KanbanInitService = KanbanInitService;
exports.KanbanInitService = KanbanInitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KanbanInitService);
//# sourceMappingURL=kanban-init.service.js.map