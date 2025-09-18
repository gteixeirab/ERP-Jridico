import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req) {
    console.log("User from request:", req.user); // Para depuração
    return this.appointmentsService.create(
      createAppointmentDto,
      req.user.userId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.appointmentsService.findAll(req.user.id);
  }
}
