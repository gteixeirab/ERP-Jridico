"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const clients_service_1 = require("./clients.service");
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
describe('ClientsService', () => {
    let service;
    let prisma;
    const mockPrisma = {
        client: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                clients_service_1.ClientsService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrisma,
                },
            ],
        }).compile();
        service = module.get(clients_service_1.ClientsService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        it('deve criar um cliente com sucesso', async () => {
            const createClienteDto = {
                name: 'Fulano de Tal',
                type: 'PESSOA_FISICA',
                document: '123.456.789-09',
                email: 'fulano@example.com',
            };
            const expected = {
                id: '1',
                ...createClienteDto,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrisma.client.create.mockResolvedValue(expected);
            const result = await service.create(createClienteDto);
            expect(result).toEqual(expected);
            expect(mockPrisma.client.create).toHaveBeenCalledWith({
                data: {
                    ...createClienteDto,
                    isActive: true,
                },
            });
        });
    });
    describe('findAll', () => {
        it('deve retornar uma lista de clientes ativos', async () => {
            const expected = [
                {
                    id: '1',
                    name: 'Cliente 1',
                    type: 'PESSOA_FISICA',
                    isActive: true,
                },
                {
                    id: '2',
                    name: 'Cliente 2',
                    type: 'PESSOA_JURIDICA',
                    isActive: true,
                },
            ];
            mockPrisma.client.findMany.mockResolvedValue(expected);
            const result = await service.findAll();
            expect(result).toEqual(expected);
            expect(mockPrisma.client.findMany).toHaveBeenCalledWith({
                where: { isActive: true },
            });
        });
    });
    describe('findOne', () => {
        it('deve retornar um cliente pelo ID', async () => {
            const expected = {
                id: '1',
                name: 'Cliente Teste',
                type: 'PESSOA_FISICA',
                isActive: true,
            };
            mockPrisma.client.findUnique.mockResolvedValue(expected);
            const result = await service.findOne('1');
            expect(result).toEqual(expected);
            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
        it('deve lançar uma exceção quando o cliente não for encontrado', async () => {
            mockPrisma.client.findUnique.mockResolvedValue(null);
            await expect(service.findOne('999')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('update', () => {
        it('deve atualizar um cliente com sucesso', async () => {
            const updateClienteDto = {
                name: 'Nome Atualizado',
                email: 'novo@email.com',
            };
            const existingClient = {
                id: '1',
                name: 'Cliente Antigo',
                email: 'antigo@email.com',
                type: 'PESSOA_FISICA',
                isActive: true,
            };
            const expected = {
                ...existingClient,
                ...updateClienteDto,
            };
            mockPrisma.client.findUnique.mockResolvedValue(existingClient);
            mockPrisma.client.update.mockResolvedValue(expected);
            const result = await service.update('1', updateClienteDto);
            expect(result).toEqual(expected);
            expect(mockPrisma.client.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: updateClienteDto,
            });
        });
    });
    describe('remove', () => {
        it('deve realizar um soft delete do cliente', async () => {
            const existingClient = {
                id: '1',
                name: 'Cliente para Remoção',
                type: 'PESSOA_FISICA',
                isActive: true,
            };
            mockPrisma.client.findUnique.mockResolvedValue(existingClient);
            mockPrisma.client.update.mockResolvedValue({ ...existingClient, isActive: false });
            await service.remove('1');
            expect(mockPrisma.client.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { isActive: false },
            });
        });
    });
    describe('search', () => {
        it('deve retornar clientes que correspondem à consulta', async () => {
            const query = 'Fulano';
            const expected = [
                {
                    id: '1',
                    name: 'Fulano de Tal',
                    type: 'PESSOA_FISICA',
                    isActive: true,
                },
            ];
            mockPrisma.client.findMany.mockResolvedValue(expected);
            const result = await service.search(query);
            expect(result).toEqual(expected);
            expect(mockPrisma.client.findMany).toHaveBeenCalledWith({
                where: {
                    isActive: true,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { document: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                    ],
                },
            });
        });
    });
});
//# sourceMappingURL=clients.service.spec.js.map