"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const cases_controller_1 = require("./cases.controller");
const cases_service_1 = require("./cases.service");
describe('CasesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [cases_controller_1.CasesController],
            providers: [
                {
                    provide: cases_service_1.CasesService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();
        controller = module.get(cases_controller_1.CasesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=cases.controller.spec.js.map