import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
// import { AppointmentServiceApp } from '../services/appointment.service';
import { AppointmentServiceApp } from '../services/appoinment.services';
// import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { CreateAppointmentDto } from '../dto/create-appoinment.dto';
import { UpdateAppointmentStatusDto } from '../dto/update-status.dto';
// import { AppointmentStatus } from '../entities/appoinment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentServiceApp) {}

  // ✅ USER: Book Appointment
  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  // ✅ USER: View own appointments
  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.appointmentService.findByUser(userId);
  }


  
  @Get()
  getAll(@Query('filter') filter: string) {
    return this.appointmentService.getAll(filter);
  }



  // ✅ USER: Cancel appointment
  @Patch(':id/cancel/user/:userId')
  cancel(@Param('id') id: number, @Param('userId') userId: number) {
    return this.appointmentService.cancelAppointment(id, userId);
  }

  @Get('user/:userId/upcoming')
  getUpcomingAppointments(@Param('userId') userId: number) {
    return this.appointmentService.getUpcomingAppointments(userId);
  }

  // ✅ ADMIN: View all
  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  // ✅ ADMIN: Update status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() dto: UpdateAppointmentStatusDto
  ) {
    return this.appointmentService.updateStatus(id, dto.status);
  }
}
