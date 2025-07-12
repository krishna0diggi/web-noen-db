import {Module} from '@nestjs/common';
import { Service } from './entities/service.desc.entity';
import { Category } from './entities/category.entity';
// import { UserServiceController } from './controller/user-service.controller';
import { ServicesController } from './controller/user-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services/user-service';
import { CategoryController } from './controller/category-controller';
import { CategoryService } from './services/category-service';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Category])],
  controllers: [ServicesController, CategoryController],
  providers: [ServicesService,CategoryService],
})
export class ServiceModuleModule {}