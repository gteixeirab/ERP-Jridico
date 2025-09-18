import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { KanbanColumnsService } from './kanban-columns.service';
import { CreateKanbanColumnDto } from './dto/create-kanban-column.dto';
import { UserRequest } from '../auth/types/user-request.interface';

@Controller('kanban/columns')
@UseGuards(JwtAuthGuard)
export class KanbanColumnsController {
  constructor(private readonly kanbanColumnsService: KanbanColumnsService) {}

  @Post()
  create(@Req() req: UserRequest, @Body() createKanbanColumnDto: CreateKanbanColumnDto) {
    return this.kanbanColumnsService.create(req.user.id, createKanbanColumnDto);
  }

  @Get()
  findAll(@Req() req: UserRequest) {
    return this.kanbanColumnsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: UserRequest, @Param('id') id: string) {
    return this.kanbanColumnsService.findOne(req.user.id, id);
  }

  @Delete(':id')
  remove(@Req() req: UserRequest, @Param('id') id: string) {
    return this.kanbanColumnsService.remove(req.user.id, id);
  }
}
