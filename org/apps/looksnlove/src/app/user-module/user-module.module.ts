import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth-controller';
import { AuthService } from './services/auth-services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserProfileService } from './services/user-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [AuthController,],
  providers: [AuthService, UserProfileService],
})
export class UserModuleModule {}
