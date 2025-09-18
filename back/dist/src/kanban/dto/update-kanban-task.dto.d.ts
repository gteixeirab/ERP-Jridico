import { CreateKanbanTaskDto } from './create-kanban-task.dto';
declare const UpdateKanbanTaskDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateKanbanTaskDto>>;
export declare class UpdateKanbanTaskDto extends UpdateKanbanTaskDto_base {
    title?: string;
    description?: string | null;
    tags?: string[];
    columnId?: string;
    status?: 'pendente' | 'em_andamento' | 'concluido' | 'aguardando';
    priority?: 'baixa' | 'media' | 'alta';
    assignedTo?: string | null;
}
export {};
