import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appoinment.entity';
import { AppointmentStatus } from '../../enum/appoinment';
import { AppointmentService } from '../entities/appoinment-service.entity';
// import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { CreateAppointmentDto } from '../dto/create-appoinment.dto';

@Injectable()
export class AppointmentServiceApp {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(AppointmentService)
    private readonly appointmentServiceRepo: Repository<AppointmentService>
  ) {}

  async create(dto: CreateAppointmentDto) {
    const { userId, date, time, totalAmount, serviceIds } = dto;

    const appointment = this.appointmentRepo.create({
      user: { id: userId },
      date,
      time,
      totalAmount,
      status: AppointmentStatus.PENDING,
    });

    const savedAppointment = await this.appointmentRepo.save(appointment);

    const serviceRelations = serviceIds.map((serviceId) =>
      this.appointmentServiceRepo.create({
        appointment: savedAppointment,
        service: { id: serviceId },
        user: { id: userId }, // Assuming the user is the one who booked the appointment
      })
    );

    await this.appointmentServiceRepo.save(serviceRelations);

    return savedAppointment;
  }

  async findAll() {
    return this.appointmentRepo.find({
      relations: ['user', 'services', 'services.service'],
      order: { createdAt: 'DESC' },
    });
  }
  async findByUser(userId: number) {
    const appointments = await this.appointmentRepo.find({
      where: { user: { id: userId } },
      relations: ['services', 'services.service'],
      order: { createdAt: 'DESC' },
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      totalAmount: appointment.totalAmount,
      status: appointment.status,
      services: appointment.services.map((s) => ({
        name: s.service.name,
        price: s.service.price,
        durationInMinutes: s.service.durationInMinutes,
      })),
    }));
  }

async getAll(filter: string): Promise<any[]> {
  const result: any[] = [];
  const query = this.appointmentRepo.createQueryBuilder('appointment')
    .leftJoinAndSelect('appointment.user', 'user')
    .leftJoinAndSelect('appointment.services', 'services')
    .leftJoinAndSelect('services.service', 'service');

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  switch (filter?.toLowerCase()) {
    case 'today':
      query.where('DATE(appointment.date) = :today', { today });
      break;

    case 'upcoming':
      query.where('appointment.date > :today', { today });
      break;

    case 'completed':
      query.where('appointment.status = :status', {
        status: AppointmentStatus.COMPLETED,
      });
      break;

    case 'cancelled':
      query.where('appointment.status = :status', {
        status: AppointmentStatus.CANCELLED,
      });
      break;

    case 'confirmed':
      query.where('appointment.status = :status', {
        status: AppointmentStatus.CONFIRMED,
      });
      break;

    case 'pending':
      query.where('appointment.status = :status', {
        status: AppointmentStatus.PENDING,
      });
      break;

    default:
      // no filter
      break;
  }

  query.orderBy('appointment.createdAt', 'DESC');

  const appointments = await query.getMany();

  for (const appointment of appointments) {
    const services = appointment.services.map((s) => ({
      name: s.service.name,
      price: s.service.price,
      durationInMinutes: s.service.durationInMinutes,
    }));

    result.push({
      id: appointment.id,
      userId: appointment.user.id,
      userName: appointment.user.name,
          userPhone: appointment.user.phone,
      date: appointment.date,
      time: appointment.time,
      totalAmount: appointment.totalAmount,
      status: appointment.status,
      services,
    });
  }

  return result;
}




  async getUpcomingAppointments(userId: number) {
    const today = new Date().toISOString().split('T')[0];

    const appointments = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.services', 'appointmentService')
      .leftJoinAndSelect('appointmentService.service', 'service')
      .where('appointment.user_id = :userId', { userId })
      .andWhere('appointment.date >= :today', { today })
      .andWhere('appointment.status != :status', { status: 'Cancelled' })
      .orderBy('appointment.date', 'ASC')
      .addOrderBy('appointment.time', 'ASC')
      .getMany();

    // ✂️ Format the result to only include needed data
    return appointments.map((a) => ({
      services: a.services.map((s) => s.service.name),
      date: a.date,
      time: a.time,
      status: a.status,
    }));
  }

  async cancelAppointment(id: number, userId: number) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!appointment)
      throw new NotFoundException('Appointment not found or not yours');

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentRepo.save(appointment);
  }

  async updateStatus(id: number, status: AppointmentStatus) {
    const appointment = await this.appointmentRepo.findOneBy({ id });
    if (!appointment) throw new NotFoundException('Appointment not found');
    appointment.status = status;
    return this.appointmentRepo.save(appointment);
  }
}
