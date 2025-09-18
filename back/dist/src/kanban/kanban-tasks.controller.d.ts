import { KanbanTasksService } from "./kanban-tasks.service";
import { CreateKanbanTaskDto } from "./dto/create-kanban-task.dto";
import { UserRequest } from "../auth/types/user-request.interface";
export declare class KanbanTasksController {
    private readonly kanbanTasksService;
    private readonly logger;
    constructor(kanbanTasksService: KanbanTasksService);
    create(req: UserRequest, createKanbanTaskDto: CreateKanbanTaskDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    findAll(req: UserRequest, columnId?: string): Promise<{
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
    }[]>;
    findOne(req: UserRequest, id: string): Promise<{
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
    }>;
    update(req: UserRequest, id: string, updateData: any): Promise<{
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
    }>;
    remove(req: UserRequest, id: string): Promise<{
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
    }>;
    moveTask(req: UserRequest, id: string, body: {
        targetColumnId: string;
        newPosition: number;
    }): Promise<{
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
    }>;
}
