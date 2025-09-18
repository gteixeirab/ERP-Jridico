import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

import { ClientsModule } from './clients/clients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { KanbanModule } from './kanban/kanban.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    PrismaModule,
    ClientsModule,
    AppointmentsModule,
    KanbanModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    // IMPORTANTE: NÃO ADICIONAR JwtAuthGuard como global aqui
    // O JwtAuthGuard deve ser aplicado apenas nas rotas que necessitam de autenticação
    // usando o decorator @UseGuards(JwtAuthGuard) nos controladores
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class AppModule {}
