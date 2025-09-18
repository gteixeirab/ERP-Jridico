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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanColumnsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const kanban_columns_service_1 = require("./kanban-columns.service");
const create_kanban_column_dto_1 = require("./dto/create-kanban-column.dto");
let KanbanColumnsController = class KanbanColumnsController {
    constructor(kanbanColumnsService) {
        this.kanbanColumnsService = kanbanColumnsService;
    }
    create(req, createKanbanColumnDto) {
        return this.kanbanColumnsService.create(req.user.id, createKanbanColumnDto);
    }
    findAll(req) {
        return this.kanbanColumnsService.findAll(req.user.id);
    }
    findOne(req, id) {
        return this.kanbanColumnsService.findOne(req.user.id, id);
    }
    remove(req, id) {
        return this.kanbanColumnsService.remove(req.user.id, id);
    }
};
exports.KanbanColumnsController = KanbanColumnsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_kanban_column_dto_1.CreateKanbanColumnDto]),
    __metadata("design:returntype", void 0)
], KanbanColumnsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KanbanColumnsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], KanbanColumnsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], KanbanColumnsController.prototype, "remove", null);
exports.KanbanColumnsController = KanbanColumnsController = __decorate([
    (0, common_1.Controller)('kanban/columns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [kanban_columns_service_1.KanbanColumnsService])
], KanbanColumnsController);
//# sourceMappingURL=kanban-columns.controller.js.map