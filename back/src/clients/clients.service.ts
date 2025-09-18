import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientResponseDto, ClientsListResponseDto } from './dto/client-response.dto';

// Interface para o cliente no banco de dados
interface Client extends ClientResponseDto {
  userId: string;
}

// Banco de dados em memória
const clients: Client[] = [];
let idCounter = 1;

@Injectable()
export class ClientsService {
  create(createClientDto: CreateClientDto, userId: string): ClientResponseDto {
    const newClient = {
      id: String(idCounter++),
      ...createClientDto,
      isActive: createClientDto.isActive ?? true,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    clients.push(newClient);
    
    // Remove o userId da resposta
    const { userId: _, ...response } = newClient;
    return response as ClientResponseDto;
  }

  findAll(params: any, userId: string): ClientsListResponseDto {
    // Filtra os clientes pelo usuário logado
    let filteredClients = clients
      .filter(client => client.userId === userId)
      .map(({ userId: _, ...client }) => client); // Remove o userId da resposta
    
    // Aplica filtros adicionais
    if (params.isActive !== undefined) {
      filteredClients = filteredClients.filter(c => String(c.isActive) === String(params.isActive));
    }
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredClients = filteredClients.filter(
        c => c.name.toLowerCase().includes(searchTerm) ||
             (c.email && c.email.toLowerCase().includes(searchTerm)) ||
             (c.phone && c.phone.includes(params.search))
      );
    }

    // Paginação
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    return {
      data: paginatedClients as ClientResponseDto[],
      total: filteredClients.length,
      page,
      limit,
      totalPages: Math.ceil(filteredClients.length / limit)
    } as ClientsListResponseDto;
  }

  findOne(id: string, userId: string): ClientResponseDto {
    const client = clients.find((c) => c.id === id && c.userId === userId);
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found or you don't have permission to access it`);
    }
    
    // Remove o userId da resposta
    const { userId: _, ...response } = client;
    return response as ClientResponseDto;
  }
}
