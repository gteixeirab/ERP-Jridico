import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class KanbanInitService implements OnModuleInit {
    private prisma;
    private readonly DEFAULT_COLUMNS;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private initializeDefaultColumns;
}
