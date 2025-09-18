"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const cases_service_1 = require("./cases.service");
const prisma_service_1 = require("../prisma/prisma.service");
describe('CasesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                cases_service_1.CasesService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        case: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();
        service = module.get(cases_service_1.CasesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=cases.service.spec.js.map