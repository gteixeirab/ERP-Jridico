import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Query,
  UseFilters,
  HttpStatus,
  HttpException,
  Logger,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { KanbanTasksService } from "./kanban-tasks.service";
import { CreateKanbanTaskDto } from "./dto/create-kanban-task.dto";
import { UserRequest } from "../auth/types/user-request.interface";
import { ValidationExceptionFilter } from "../common/filters/validation-exception.filter";

@Controller("kanban/tasks")
@UseGuards(JwtAuthGuard)
@UseFilters(new ValidationExceptionFilter())
export class KanbanTasksController {
  private readonly logger = new Logger(KanbanTasksController.name);

  constructor(private readonly kanbanTasksService: KanbanTasksService) {}

  @Post()
  async create(
    @Req() req: UserRequest,
    @Body() createKanbanTaskDto: CreateKanbanTaskDto
  ) {
    try {
      // Obtém o userId do payload do JWT (que está em req.user.userId)
      const userId = req.user?.userId;
      
      // Log detalhado para depuração
      console.log('Dados do usuário na requisição:', {
        user: req.user,
        userId: userId,
        email: req.user?.email,
        headers: req.headers
      });

      this.logger.log(
        `Tentativa de criar tarefa para o usuário ${userId}`
      );
      
      if (!userId) {
        throw new HttpException(
          'ID do usuário não encontrado no token',
          HttpStatus.UNAUTHORIZED
        );
      }

      const task = await this.kanbanTasksService.create(
        userId,
        createKanbanTaskDto
      );

      return {
        success: true,
        message: "Tarefa criada com sucesso",
        data: task,
      };
    } catch (error) {
      this.logger.error(`Erro ao criar tarefa: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || "Ocorreu um erro ao processar sua solicitação",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  findAll(@Req() req: UserRequest, @Query("columnId") columnId?: string) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException(
        'ID do usuário não encontrado no token',
        HttpStatus.UNAUTHORIZED
      );
    }
    return this.kanbanTasksService.findAll(userId, columnId);
  }

  @Get(":id")
  findOne(@Req() req: UserRequest, @Param("id") id: string) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException(
        'ID do usuário não encontrado no token',
        HttpStatus.UNAUTHORIZED
      );
    }
    return this.kanbanTasksService.findOne(userId, id);
  }

  @Put(":id")
  update(
    @Req() req: UserRequest,
    @Param("id") id: string,
    @Body() updateData: any
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException(
        'ID do usuário não encontrado no token',
        HttpStatus.UNAUTHORIZED
      );
    }
    return this.kanbanTasksService.update(userId, id, updateData);
  }

  @Delete(":id")
  remove(@Req() req: UserRequest, @Param("id") id: string) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException(
        'ID do usuário não encontrado no token',
        HttpStatus.UNAUTHORIZED
      );
    }
    return this.kanbanTasksService.remove(userId, id);
  }

  @Post(":id/move")
  moveTask(
    @Req() req: UserRequest,
    @Param("id") id: string,
    @Body() body: { targetColumnId: string; newPosition: number }
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException(
        'ID do usuário não encontrado no token',
        HttpStatus.UNAUTHORIZED
      );
    }
    return this.kanbanTasksService.moveTask(
      userId,
      id,
      body.targetColumnId,
      body.newPosition
    );
  }
}
