// ✅ 1. appointment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user-module/entities/user.entity';
import { AppointmentService } from './appoinment-service.entity';
import { AppointmentStatus } from '../../enum/appoinment';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'time' })
  time!: string;

  @Column({ type: 'varchar', length: 20, default: '1hr' })
  duration!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status!: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  specialPreferences?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  whatsappNumber?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(
    () => AppointmentService,
    (appointmentService) => appointmentService.appointment,
    {
      cascade: true,
    }
  )
  services!: AppointmentService[];
}
