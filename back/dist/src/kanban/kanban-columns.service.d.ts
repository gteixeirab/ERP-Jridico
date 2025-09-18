import { PrismaService } from '../prisma/prisma.service';
import { CreateKanbanColumnDto } from './dto/create-kanban-column.dto';
export declare class KanbanColumnsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createKanbanColumnDto: CreateKanbanColumnDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        columnType: string;
        sortOrder: number;
        createdBy: string;
    }>;
    findAll(userId: string): Promise<({
        tasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            sortOrder: number;
            createdBy: string;
            description: string | null;
            tags: string;
            columnId: string;
            assignedTo: string | null;
            dueDate: Date | null;
            priority: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        columnType: string;
        sortOrder: number;
        createdBy: string;
    })[]>;
    findOne(userId: string, id: string): Promise<{
        tasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            sortOrder: number;
            createdBy: string;
            description: string | null;
            tags: string;
            columnId: string;
            assignedTo: string | null;
            dueDate: Date | null;
            priority: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        columnType: string;
        sortOrder: number;
        createdBy: string;
    }>;
    remove(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        columnType: string;
        sortOrder: number;
        createdBy: string;
    }>;
}
