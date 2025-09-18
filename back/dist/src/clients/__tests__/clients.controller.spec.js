"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const clients_controller_1 = require("../clients.controller");
const clients_service_1 = require("../clients.service");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const cliente_response_dto_1 = require("../dto/cliente-response.dto");
const createMockRequest = (user) => ({
    user,
    headers: {},
    body: {},
    params: {},
    query: {},
    cookies: {},
    signedCookies: {},
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
});
const mockClient = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Cliente de Teste',
    type: 'PF',
    document: '123.456.789-00',
    email: 'cliente@teste.com',
    phone: '(11) 98765-4321',
    mobile: '(11) 98765-4321',
    address: JSON.stringify({
        street: 'Rua Teste',
        number: '123',
        complement: 'Apto 45',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000'
    }),
    birthDate: new Date('1990-01-01'),
    profession: 'Advogado',
    maritalStatus: 'Solteiro(a)',
    notes: 'Cliente VIP',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockClientResponse = new cliente_response_dto_1.ClienteResponseDto(mockClient);
const mockClientList = [mockClientResponse, { ...mockClientResponse, id: '123e4567-e89b-12d3-a456-426614174001' }];
describe('ClientsController', () => {
    let controller;
    let mockService;
    let adminRequest;
    let clientRequest;
    let mockAuthGuard;
    let mockRolesGuard;
    const mockAdminUser = {
        id: 'user-1',
        email: 'admin@example.com',
        roles: [user_role_enum_1.UserRole.ADMIN],
    };
    const mockClientUser = {
        id: 'user-2',
        email: 'client@example.com',
        roles: [user_role_enum_1.UserRole.CLIENT],
    };
    const mockJwtAuthGuard = {
        canActivate: (context) => {
            const req = context.switchToHttp().getRequest();
            req.user = req.user || mockAdminUser;
            return true;
        },
    };
    const mockRolesGuardImpl = {
        canActivate: jest.fn().mockReturnValue(true),
    };
    beforeEach(async () => {
        mockAuthGuard = {
            canActivate: jest.fn().mockReturnValue(true),
        };
        mockRolesGuard = {
            canActivate: jest.fn().mockReturnValue(true),
        };
        mockService = {
            prisma: {
                client: {
                    create: jest.fn(),
                    findMany: jest.fn(),
                    findUnique: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn(),
                },
            },
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            search: jest.fn(),
        };
        adminRequest = createMockRequest(mockAdminUser);
        clientRequest = createMockRequest(mockClientUser);
        jest.clearAllMocks();
        const module = await testing_1.Test.createTestingModule({
            controllers: [clients_controller_1.ClientsController],
            providers: [
                {
                    provide: clients_service_1.ClientsService,
                    useValue: mockService,
                },
            ],
        })
            .overrideGuard(jwt_auth_guard_1.JwtAuthGuard)
            .useValue(mockAuthGuard)
            .overrideGuard(roles_guard_1.RolesGuard)
            .useValue(mockRolesGuard)
            .compile();
        controller = module.get(clients_controller_1.ClientsController);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('deve criar um novo cliente', async () => {
            const createClienteDto = {
                name: 'Novo Cliente',
                type: 'PESSOA_FISICA',
                document: '123.456.789-09',
                email: 'cliente@example.com',
            };
            const expected = {
                id: 'cliente-1',
                ...createClienteDto,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockService.create.mockResolvedValue(expected);
            const result = await controller.create(createClienteDto, adminRequest);
            expect(result).toEqual(expected);
            expect(mockService.create).toHaveBeenCalledWith(createClienteDto);
        });
        it('deve estar protegido pelo JwtAuthGuard e RolesGuard', () => {
            const controllerGuards = Reflect.getMetadata('__guards__', clients_controller_1.ClientsController) || [];
            const guardNames = controllerGuards.map(guard => guard?.name || guard?.prototype?.constructor?.name);
            const hasJwtAuthGuard = guardNames.some(name => name === 'JwtAuthGuard' || name === 'JwtAuthGuard');
            const hasRolesGuard = guardNames.some(name => name === 'RolesGuard' || name === 'RolesGuard');
            expect(hasJwtAuthGuard).toBeTruthy();
            expect(hasRolesGuard).toBeTruthy();
        });
        it('deve exigir as roles corretas', () => {
            const roles = Reflect.getMetadata('roles', clients_controller_1.ClientsController.prototype.create) || [];
            expect(roles).toContain(user_role_enum_1.UserRole.ADMIN);
            expect(roles).toContain(user_role_enum_1.UserRole.ATTORNEY);
            expect(roles).toContain(user_role_enum_1.UserRole.ASSISTANT);
            expect(roles).toHaveLength(3);
        });
    });
    describe('findAll', () => {
        it('deve retornar uma lista de clientes', async () => {
            const expected = [
                new cliente_response_dto_1.ClienteResponseDto({
                    id: 'cliente-1',
                    name: 'Cliente 1',
                    type: 'PESSOA_FISICA',
                    document: '123.456.789-09',
                    email: 'cliente1@example.com',
                    phone: '(11) 99999-9999',
                    mobile: '(11) 98888-8888',
                    address: {
                        street: 'Rua Exemplo',
                        number: '123',
                        complement: 'Sala 1',
                        neighborhood: 'Centro',
                        city: 'São Paulo',
                        state: 'SP',
                        zipCode: '01234-567'
                    },
                    notes: 'Cliente de teste',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            ];
            mockService.findAll.mockResolvedValue(expected);
            const result = await controller.findAll(adminRequest);
            expect(result).toEqual(expected);
            expect(mockService.findAll).toHaveBeenCalled();
        });
        it('deve estar protegido pelo JwtAuthGuard e RolesGuard', () => {
            const controllerGuards = Reflect.getMetadata('__guards__', clients_controller_1.ClientsController) || [];
            const guardNames = controllerGuards.map(guard => guard?.name || guard?.prototype?.constructor?.name);
            const hasJwtAuthGuard = guardNames.some(name => name === 'JwtAuthGuard' || name === 'JwtAuthGuard');
            const hasRolesGuard = guardNames.some(name => name === 'RolesGuard' || name === 'RolesGuard');
            expect(hasJwtAuthGuard).toBeTruthy();
            expect(hasRolesGuard).toBeTruthy();
        });
        it('deve permitir as roles corretas', () => {
            const roles = Reflect.getMetadata('roles', clients_controller_1.ClientsController.prototype.findAll) || [];
            expect(roles).toContain(user_role_enum_1.UserRole.ADMIN);
            expect(roles).toContain(user_role_enum_1.UserRole.ATTORNEY);
            expect(roles).toContain(user_role_enum_1.UserRole.ASSISTANT);
            expect(roles).toContain(user_role_enum_1.UserRole.INTERN);
            expect(roles).toHaveLength(4);
        });
    });
    describe('search', () => {
        it('deve retornar clientes que correspondem à consulta', async () => {
            const query = 'Fulano';
            const expected = [
                new cliente_response_dto_1.ClienteResponseDto({
                    id: 'cliente-1',
                    name: 'Fulano de Tal',
                    type: 'PESSOA_FISICA',
                    document: '123.456.789-09',
                    email: 'fulano@example.com',
                    phone: '(11) 99999-9999',
                    mobile: '(11) 98888-8888',
                    address: {
                        street: 'Rua Exemplo',
                        number: '123',
                        complement: 'Sala 1',
                        neighborhood: 'Centro',
                        city: 'São Paulo',
                        state: 'SP',
                        zipCode: '01234-567'
                    },
                    notes: 'Cliente de teste',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            ];
            mockService.search.mockResolvedValue(expected);
            const result = await controller.search(query, adminRequest);
            expect(result).toEqual(expected);
            expect(mockService.search).toHaveBeenCalledWith(query);
        });
        it('deve chamar findAll se a consulta for vazia', async () => {
            const query = '';
            const expected = [
                new cliente_response_dto_1.ClienteResponseDto({
                    id: 'cliente-1',
                    name: 'Cliente 1',
                    type: 'PESSOA_FISICA',
                    document: '123.456.789-09',
                    email: 'cliente1@example.com',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            ];
            mockService.findAll.mockResolvedValue(expected);
            const result = await controller.search(query, adminRequest);
            expect(result).toEqual(expected);
            expect(mockService.findAll).toHaveBeenCalled();
            expect(mockService.search).not.toHaveBeenCalled();
        });
    });
    describe('findOne', () => {
        it('deve retornar um cliente pelo ID', async () => {
            const clientId = '123e4567-e89b-12d3-a456-426614174000';
            const expected = new cliente_response_dto_1.ClienteResponseDto({
                id: clientId,
                name: 'Cliente Específico',
                type: 'PESSOA_FISICA',
                document: '987.654.321-00',
                email: 'especifico@example.com',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockService.findOne.mockResolvedValue(expected);
            const result = await controller.findOne(clientId, adminRequest);
            expect(result).toEqual(expected);
            expect(mockService.findOne).toHaveBeenCalledWith(clientId);
        });
        it('deve lançar NotFoundException se o cliente não for encontrado', async () => {
            const clientId = 'id-inexistente';
            mockService.findOne.mockRejectedValue(new common_1.NotFoundException());
            await expect(controller.findOne(clientId, adminRequest)).rejects.toThrow(common_1.NotFoundException);
        });
        it('deve estar protegido pelo JwtAuthGuard e RolesGuard', () => {
            const controllerGuards = Reflect.getMetadata('__guards__', clients_controller_1.ClientsController) || [];
            const guardNames = controllerGuards.map(guard => guard?.name || guard?.prototype?.constructor?.name);
            const hasJwtAuthGuard = guardNames.some(name => name === 'JwtAuthGuard' || name === 'JwtAuthGuard');
            const hasRolesGuard = guardNames.some(name => name === 'RolesGuard' || name === 'RolesGuard');
            expect(hasJwtAuthGuard).toBeTruthy();
            expect(hasRolesGuard).toBeTruthy();
        });
        it('deve permitir as roles corretas', () => {
            const roles = Reflect.getMetadata('roles', clients_controller_1.ClientsController.prototype.findOne) || [];
            expect(roles).toContain(user_role_enum_1.UserRole.ADMIN);
            expect(roles).toContain(user_role_enum_1.UserRole.ATTORNEY);
            expect(roles).toContain(user_role_enum_1.UserRole.ASSISTANT);
            expect(roles).toContain(user_role_enum_1.UserRole.INTERN);
            expect(roles).toHaveLength(4);
        });
    });
    describe('update', () => {
        it('deve atualizar um cliente existente', async () => {
            const clientId = '123e4567-e89b-12d3-a456-426614174000';
            const updateDto = {
                name: 'Nome Atualizado',
                email: 'atualizado@example.com',
            };
            const expected = new cliente_response_dto_1.ClienteResponseDto({
                id: clientId,
                name: 'Nome Atualizado',
                type: 'PESSOA_FISICA',
                document: '123.456.789-09',
                email: 'atualizado@example.com',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockService.update.mockResolvedValue(expected);
            const result = await controller.update(clientId, updateDto, adminRequest);
            expect(result).toEqual(expected);
            expect(mockService.update).toHaveBeenCalledWith(clientId, updateDto);
        });
        it('deve lançar NotFoundException se o cliente não for encontrado', async () => {
            const clientId = 'id-inexistente';
            const updateDto = {
                name: 'Nome Atualizado',
            };
            mockService.update.mockRejectedValue(new common_1.NotFoundException());
            await expect(controller.update(clientId, updateDto, adminRequest))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('deve estar protegido pelo JwtAuthGuard e RolesGuard', () => {
            const controllerGuards = Reflect.getMetadata('__guards__', clients_controller_1.ClientsController) || [];
            const guardNames = controllerGuards.map(guard => guard?.name || guard?.prototype?.constructor?.name);
            const hasJwtAuthGuard = guardNames.some(name => name === 'JwtAuthGuard' || name === 'JwtAuthGuard');
            const hasRolesGuard = guardNames.some(name => name === 'RolesGuard' || name === 'RolesGuard');
            expect(hasJwtAuthGuard).toBeTruthy();
            expect(hasRolesGuard).toBeTruthy();
        });
        it('deve exigir as roles corretas', () => {
            const roles = Reflect.getMetadata('roles', clients_controller_1.ClientsController.prototype.update) || [];
            expect(roles).toContain(user_role_enum_1.UserRole.ADMIN);
            expect(roles).toContain(user_role_enum_1.UserRole.ATTORNEY);
            expect(roles).toContain(user_role_enum_1.UserRole.ASSISTANT);
            expect(roles).toHaveLength(3);
        });
    });
    describe('remove', () => {
        it('deve remover um cliente existente', async () => {
            const clientId = '123e4567-e89b-12d3-a456-426614174000';
            mockService.remove.mockResolvedValue(undefined);
            await controller.remove(clientId, adminRequest);
            expect(mockService.remove).toHaveBeenCalledWith(clientId);
        });
        it('deve lançar NotFoundException se o cliente não for encontrado', async () => {
            const clientId = 'id-inexistente';
            mockService.remove.mockRejectedValue(new common_1.NotFoundException());
            await expect(controller.remove(clientId, adminRequest))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('deve estar protegido pelo JwtAuthGuard e RolesGuard', () => {
            const controllerGuards = Reflect.getMetadata('__guards__', clients_controller_1.ClientsController) || [];
            const guardNames = controllerGuards.map(guard => guard?.name || guard?.prototype?.constructor?.name);
            const hasJwtAuthGuard = guardNames.some(name => name === 'JwtAuthGuard' || name === 'JwtAuthGuard');
            const hasRolesGuard = guardNames.some(name => name === 'RolesGuard' || name === 'RolesGuard');
            expect(hasJwtAuthGuard).toBeTruthy();
            expect(hasRolesGuard).toBeTruthy();
        });
        it('deve exigir as roles corretas', () => {
            const roles = Reflect.getMetadata('roles', clients_controller_1.ClientsController.prototype.remove) || [];
            expect(roles).toContain(user_role_enum_1.UserRole.ADMIN);
            expect(roles).toContain(user_role_enum_1.UserRole.ATTORNEY);
            expect(roles).toHaveLength(2);
        });
    });
});
//# sourceMappingURL=clients.controller.spec.js.map