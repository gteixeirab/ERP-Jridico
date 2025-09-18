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
exports.KanbanModule = void 0;
const common_1 = require("@nestjs/common");
const kanban_columns_controller_1 = require("./kanban-columns.controller");
const kanban_tasks_controller_1 = require("./kanban-tasks.controller");
const kanban_columns_service_1 = require("./kanban-columns.service");
const kanban_tasks_service_1 = require("./kanban-tasks.service");
const kanban_init_service_1 = require("./kanban-init.service");
const prisma_service_1 = require("../prisma/prisma.service");
let KanbanModule = class KanbanModule {
    constructor(kanbanInitService) {
        this.kanbanInitService = kanbanInitService;
    }
    onModuleInit() {
    }
};
exports.KanbanModule = KanbanModule;
exports.KanbanModule = KanbanModule = __decorate([
    (0, common_1.Module)({
        controllers: [kanban_columns_controller_1.KanbanColumnsController, kanban_tasks_controller_1.KanbanTasksController],
        providers: [
            kanban_columns_service_1.KanbanColumnsService,
            kanban_tasks_service_1.KanbanTasksService,
            kanban_init_service_1.KanbanInitService,
            prisma_service_1.PrismaService
        ],
        exports: [kanban_columns_service_1.KanbanColumnsService, kanban_tasks_service_1.KanbanTasksService],
    }),
    __metadata("design:paramtypes", [kanban_init_service_1.KanbanInitService])
], KanbanModule);
//# sourceMappingURL=kanban.module.js.map