import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KanbanInitService implements OnModuleInit {
  private readonly DEFAULT_COLUMNS = [
    { title: 'A Fazer', columnType: 'PENDENTE', sortOrder: 1 },
    { title: 'Em Andamento', columnType: 'EM_ANDAMENTO', sortOrder: 2 },
    { title: 'Concluído', columnType: 'CONCLUIDA', sortOrder: 3 },
    { title: 'Aguardando', columnType: 'PENDENTE', sortOrder: 0 },
  ];

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.initializeDefaultColumns();
  }

  private async initializeDefaultColumns() {
    try {
      // Verifica se já existem colunas no banco de dados
      const existingColumns = await this.prisma.kanbanColumn.findMany();
      
      // Se não houver colunas, cria as colunas padrão
      if (existingColumns.length === 0) {
        console.log('Criando colunas padrão do Kanban...');
        
        // Cria as colunas padrão para cada usuário existente
        const users = await this.prisma.user.findMany();
        
        for (const user of users) {
          for (const column of this.DEFAULT_COLUMNS) {
            await this.prisma.kanbanColumn.create({
              data: {
                ...column,
                createdBy: user.id,
              },
            });
          }
        }
        
        console.log('Colunas padrão do Kanban criadas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao inicializar colunas padrão do Kanban:', error);
    }
  }
}
