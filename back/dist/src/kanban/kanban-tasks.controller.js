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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var KanbanTasksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanTasksController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const kanban_tasks_service_1 = require("./kanban-tasks.service");
const create_kanban_task_dto_1 = require("./dto/create-kanban-task.dto");
const validation_exception_filter_1 = require("../common/filters/validation-exception.filter");
let KanbanTasksController = KanbanTasksController_1 = class KanbanTasksController {
    constructor(kanbanTasksService) {
        this.kanbanTasksService = kanbanTasksService;
        this.logger = new common_1.Logger(KanbanTasksController_1.name);
    }
    async create(req, createKanbanTaskDto) {
        try {
            const userId = req.user?.userId;
            console.log('Dados do usuário na requisição:', {
                user: req.user,
                userId: userId,
                email: req.user?.email,
                headers: req.headers
            });
            this.logger.log(`Tentativa de criar tarefa para o usuário ${userId}`);
            if (!userId) {
                throw new common_1.HttpException('ID do usuário não encontrado no token', common_1.HttpStatus.UNAUTHORIZED);
            }
            const task = await this.kanbanTasksService.create(userId, createKanbanTaskDto);
            return {
                success: true,
                message: "Tarefa criada com sucesso",
                data: task,
            };
        }
        catch (error) {
            this.logger.error(`Erro ao criar tarefa: ${error.message}`, error.stack);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || "Ocorreu um erro ao processar sua solicitação", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    findAll(req, columnId) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.HttpException('ID do usuário não encontrado no token', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.kanbanTasksService.findAll(userId, columnId);
    }
    findOne(req, id) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.HttpException('ID do usuário não encontrado no token', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.kanbanTasksService.findOne(userId, id);
    }
    update(req, id, updateData) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.HttpException('ID do usuário não encontrado no token', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.kanbanTasksService.update(userId, id, updateData);
    }
    remove(req, id) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.HttpException('ID do usuário não encontrado no token', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.kanbanTasksService.remove(userId, id);
    }
    moveTask(req, id, body) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.HttpException('ID do usuário não encontrado no token', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.kanbanTasksService.moveTask(userId, id, body.targetColumnId, body.newPosition);
    }
};
exports.KanbanTasksController = KanbanTasksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_kanban_task_dto_1.CreateKanbanTaskDto]),
    __metadata("design:returntype", Promise)
], KanbanTasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("columnId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], KanbanTasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], KanbanTasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], KanbanTasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], KanbanTasksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/move"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], KanbanTasksController.prototype, "moveTask", null);
exports.KanbanTasksController = KanbanTasksController = KanbanTasksController_1 = __decorate([
    (0, common_1.Controller)("kanban/tasks"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(new validation_exception_filter_1.ValidationExceptionFilter()),
    __metadata("design:paramtypes", [kanban_tasks_service_1.KanbanTasksService])
], KanbanTasksController);
//# sourceMappingURL=kanban-tasks.controller.js.map