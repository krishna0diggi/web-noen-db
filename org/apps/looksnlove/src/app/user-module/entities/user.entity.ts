import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Role } from "./role.entity";
import { Appointment } from "../../appoinment-module/entities/appoinment.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  phone!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
address!: string;


  @Column({ name: "otp" })
  otp!: string;

  @Column({ nullable: true })
  token!: string;

  @Column({ name: "is_verified", default: false, type: "boolean" })
  isVerified!: boolean;

  @Column({ name: "otp_expires_at", type: "timestamp", nullable: true })
  otpExpiresAt!: Date | null;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments!: Appointment[];
}
