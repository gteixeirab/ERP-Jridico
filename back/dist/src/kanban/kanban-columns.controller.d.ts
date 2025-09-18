import { KanbanColumnsService } from './kanban-columns.service';
import { CreateKanbanColumnDto } from './dto/create-kanban-column.dto';
import { UserRequest } from '../auth/types/user-request.interface';
export declare class KanbanColumnsController {
    private readonly kanbanColumnsService;
    constructor(kanbanColumnsService: KanbanColumnsService);
    create(req: UserRequest, createKanbanColumnDto: CreateKanbanColumnDto): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        columnType: string;
    }>;
    findAll(req: UserRequest): Promise<({
        tasks: {
            id: string;
            title: string;
            description: string | null;
            sortOrder: number;
            tags: string;
            columnId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            assignedTo: string | null;
            dueDate: Date | null;
            priority: string | null;
        }[];
    } & {
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        columnType: string;
    })[]>;
    findOne(req: UserRequest, id: string): Promise<{
        tasks: {
            id: string;
            title: string;
            description: string | null;
            sortOrder: number;
            tags: string;
            columnId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            assignedTo: string | null;
            dueDate: Date | null;
            priority: string | null;
        }[];
    } & {
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        columnType: string;
    }>;
    remove(req: UserRequest, id: string): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        columnType: string;
    }>;
}
