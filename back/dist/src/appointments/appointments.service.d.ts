import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAppointmentDto: CreateAppointmentDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        date: Date;
        time: string;
        clientName: string;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        date: Date;
        time: string;
        clientName: string;
    }[]>;
}
