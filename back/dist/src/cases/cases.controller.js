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
exports.CasesController = void 0;
const common_1 = require("@nestjs/common");
const cases_service_1 = require("./cases.service");
const create_case_dto_1 = require("./dto/create-case.dto");
const update_case_dto_1 = require("./dto/update-case.dto");
let CasesController = class CasesController {
    constructor(casesService) {
        this.casesService = casesService;
    }
    create(createCaseDto) {
        return this.casesService.create(createCaseDto);
    }
    findAll() {
        return this.casesService.findAll();
    }
    async findOne(id) {
        const caseItem = await this.casesService.findOne(id);
        if (!caseItem) {
            throw new common_1.NotFoundException(`Caso com ID "${id}" não encontrado`);
        }
        return caseItem;
    }
    update(id, updateCaseDto) {
        return this.casesService.update(id, updateCaseDto);
    }
    remove(id) {
        return this.casesService.remove(id);
    }
};
exports.CasesController = CasesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_case_dto_1.CreateCaseDto]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_case_dto_1.UpdateCaseDto]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "remove", null);
exports.CasesController = CasesController = __decorate([
    (0, common_1.Controller)('cases'),
    __metadata("design:paramtypes", [cases_service_1.CasesService])
], CasesController);
//# sourceMappingURL=cases.controller.js.map