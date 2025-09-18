import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
export declare class CasesController {
    private readonly casesService;
    constructor(casesService: CasesService);
    create(createCaseDto: CreateCaseDto): Promise<{
        id: string;
        processNumber: string;
        title: string;
        status: string;
        createdAt: Date;
        clientId: string;
        responsibleId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        processNumber: string;
        title: string;
        status: string;
        createdAt: Date;
        clientId: string;
        responsibleId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        client: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        processNumber: string;
        title: string;
        status: string;
        createdAt: Date;
        clientId: string;
        responsibleId: string | null;
    }>;
    update(id: string, updateCaseDto: UpdateCaseDto): Promise<{
        client: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        processNumber: string;
        title: string;
        status: string;
        createdAt: Date;
        clientId: string;
        responsibleId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        processNumber: string;
        title: string;
        status: string;
        createdAt: Date;
        clientId: string;
        responsibleId: string | null;
    }>;
}
