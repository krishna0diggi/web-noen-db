import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONFIG } from '../config/DB.config';
import { UserModuleModule } from './user-module/user-module.module';
import { ServiceModuleModule } from './services-module/service-module.module';
import { AppoinmentModule } from './appoinment-module/appoinment-module.module';

@Module({
  imports: [TypeOrmModule.forRoot(DB_CONFIG), UserModuleModule, ServiceModuleModule,AppoinmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
