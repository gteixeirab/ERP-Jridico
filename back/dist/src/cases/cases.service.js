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
exports.CasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CasesService = class CasesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCaseDto) {
        return this.prisma.case.create({
            data: {
                title: createCaseDto.title,
                description: createCaseDto.description,
                status: createCaseDto.status,
                processNumber: createCaseDto.processNumber || null,
                court: createCaseDto.court || null,
                judge: createCaseDto.judge || null,
                notes: createCaseDto.notes || null,
                client: {
                    connect: { id: createCaseDto.clientId },
                },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.case.findMany({
            where: { isActive: true },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const caseItem = await this.prisma.case.findUnique({
            where: { id },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return caseItem;
    }
    async update(id, updateCaseDto) {
        const existingCase = await this.findOne(id);
        if (!existingCase) {
            throw new common_1.NotFoundException(`Caso com ID "${id}" não encontrado`);
        }
        const data = {
            title: updateCaseDto.title,
            description: updateCaseDto.description,
            status: updateCaseDto.status,
            processNumber: updateCaseDto.processNumber,
            court: updateCaseDto.court,
            judge: updateCaseDto.judge,
            notes: updateCaseDto.notes,
        };
        if (updateCaseDto.clientId) {
            data.client = {
                connect: { id: updateCaseDto.clientId },
            };
        }
        return this.prisma.case.update({
            where: { id },
            data,
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        const existingCase = await this.findOne(id);
        if (!existingCase) {
            throw new common_1.NotFoundException(`Caso com ID "${id}" não encontrado`);
        }
        return this.prisma.case.delete({
            where: { id },
        });
    }
};
exports.CasesService = CasesService;
exports.CasesService = CasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CasesService);
//# sourceMappingURL=cases.service.js.map