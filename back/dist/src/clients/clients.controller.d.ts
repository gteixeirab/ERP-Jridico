import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(req: any, createClientDto: CreateClientDto): import("./dto/client-response.dto").ClientResponseDto;
    findAll(req: any, query: any): import("./dto/client-response.dto").ClientsListResponseDto;
    findOne(req: any, id: string): import("./dto/client-response.dto").ClientResponseDto;
}
