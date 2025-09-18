"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const clients = [];
let idCounter = 1;
let ClientsService = class ClientsService {
    create(createClientDto, userId) {
        const newClient = {
            id: String(idCounter++),
            ...createClientDto,
            isActive: createClientDto.isActive ?? true,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        clients.push(newClient);
        const { userId: _, ...response } = newClient;
        return response;
    }
    findAll(params, userId) {
        let filteredClients = clients
            .filter(client => client.userId === userId)
            .map(({ userId: _, ...client }) => client);
        if (params.isActive !== undefined) {
            filteredClients = filteredClients.filter(c => String(c.isActive) === String(params.isActive));
        }
        if (params.search) {
            const searchTerm = params.search.toLowerCase();
            filteredClients = filteredClients.filter(c => c.name.toLowerCase().includes(searchTerm) ||
                (c.email && c.email.toLowerCase().includes(searchTerm)) ||
                (c.phone && c.phone.includes(params.search)));
        }
        const page = parseInt(params.page, 10) || 1;
        const limit = parseInt(params.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedClients = filteredClients.slice(startIndex, endIndex);
        return {
            data: paginatedClients,
            total: filteredClients.length,
            page,
            limit,
            totalPages: Math.ceil(filteredClients.length / limit)
        };
    }
    findOne(id, userId) {
        const client = clients.find((c) => c.id === id && c.userId === userId);
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID "${id}" not found or you don't have permission to access it`);
        }
        const { userId: _, ...response } = client;
        return response;
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)()
], ClientsService);
//# sourceMappingURL=clients.service.js.map