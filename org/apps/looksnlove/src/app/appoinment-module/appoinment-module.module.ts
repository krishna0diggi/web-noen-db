import {Module} from '@nestjs/common';
import { AppointmentController } from './controller/appoinment.controller';
import { AppointmentServiceApp } from './services/appoinment.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appoinment.entity';
import { AppointmentService } from './entities/appoinment-service.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Appointment, AppointmentService])],
  controllers: [AppointmentController],
  providers: [AppointmentServiceApp],
})
export class AppoinmentModule {}