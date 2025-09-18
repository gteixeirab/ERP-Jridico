import { Module, OnModuleInit } from '@nestjs/common';
import { KanbanColumnsController } from './kanban-columns.controller';
import { KanbanTasksController } from './kanban-tasks.controller';
import { KanbanColumnsService } from './kanban-columns.service';
import { KanbanTasksService } from './kanban-tasks.service';
import { KanbanInitService } from './kanban-init.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [KanbanColumnsController, KanbanTasksController],
  providers: [
    KanbanColumnsService, 
    KanbanTasksService, 
    KanbanInitService,
    PrismaService
  ],
  exports: [KanbanColumnsService, KanbanTasksService],
})
export class KanbanModule implements OnModuleInit {
  constructor(private readonly kanbanInitService: KanbanInitService) {}

  onModuleInit() {
    // O KanbanInitService já implementa OnModuleInit e será chamado automaticamente
  }
}
