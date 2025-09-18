import { CreateClientDto } from './dto/create-client.dto';
import { ClientResponseDto, ClientsListResponseDto } from './dto/client-response.dto';
export declare class ClientsService {
    create(createClientDto: CreateClientDto, userId: string): ClientResponseDto;
    findAll(params: any, userId: string): ClientsListResponseDto;
    findOne(id: string, userId: string): ClientResponseDto;
}
