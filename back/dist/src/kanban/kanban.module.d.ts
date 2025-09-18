import { OnModuleInit } from '@nestjs/common';
import { KanbanInitService } from './kanban-init.service';
export declare class KanbanModule implements OnModuleInit {
    private readonly kanbanInitService;
    constructor(kanbanInitService: KanbanInitService);
    onModuleInit(): void;
}
