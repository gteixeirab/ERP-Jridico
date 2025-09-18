import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        date: new Date(createAppointmentDto.date),
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: {
        date: 'asc',
      },
    });
  }
}
