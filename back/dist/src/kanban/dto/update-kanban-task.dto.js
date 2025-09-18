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
exports.UpdateKanbanTaskDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_kanban_task_dto_1 = require("./create-kanban-task.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateKanbanTaskDto extends (0, mapped_types_1.PartialType)(create_kanban_task_dto_1.CreateKanbanTaskDto) {
}
exports.UpdateKanbanTaskDto = UpdateKanbanTaskDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'O título deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? String(value).trim() : undefined),
    __metadata("design:type", String)
], UpdateKanbanTaskDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'A descrição deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === null || value === undefined || value === '')
            return null;
        return String(value).trim();
    }),
    __metadata("design:type", String)
], UpdateKanbanTaskDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'As tags devem ser um array de strings' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === null || value === undefined)
            return [];
        return Array.isArray(value) ? value.map(String) : [String(value)];
    }),
    __metadata("design:type", Array)
], UpdateKanbanTaskDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O ID da coluna deve ser uma string' }),
    (0, class_validator_1.IsUUID)(4, { message: 'O ID da coluna deve ser um UUID válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateKanbanTaskDto.prototype, "columnId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O status deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return undefined;
        return String(value).toLowerCase();
    }),
    (0, class_validator_1.IsIn)(['pendente', 'em_andamento', 'concluido', 'aguardando'], {
        message: 'Status inválido. Use: pendente, em_andamento, concluido ou aguardando'
    }),
    __metadata("design:type", String)
], UpdateKanbanTaskDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'A prioridade deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return undefined;
        return String(value).toLowerCase();
    }),
    (0, class_validator_1.IsIn)(['baixa', 'media', 'alta'], {
        message: 'A prioridade deve ser "baixa", "media" ou "alta"'
    }),
    __metadata("design:type", String)
], UpdateKanbanTaskDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O ID do responsável deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value || null),
    __metadata("design:type", String)
], UpdateKanbanTaskDto.prototype, "assignedTo", void 0);
//# sourceMappingURL=update-kanban-task.dto.js.map