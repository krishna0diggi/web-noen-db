import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Appointment } from './appoinment.entity';
import { Service } from '../../services-module/entities/service.desc.entity';
import { User } from '../../user-module/entities/user.entity';

@Entity()
export class AppointmentService {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Appointment, appointment => appointment.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service!: Service;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
