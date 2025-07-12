
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Headers,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth-services';
import { UserProfileService } from '../services/user-profile.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userProfileService: UserProfileService
  ) {}

  @Post('verify-phone')
  async verifyPhone(@Body('phone') phone: string) {
    return this.authService.verifyPhone(phone);
  }
  @Post('login')
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }
  @Get('me')
  async getMe(@Headers('Authorization') authHeader: string) {
    return this.authService.getCurrentUser(authHeader);
  }

  @Get('profile')
  async getProfile(@Query('id') id: string) {
    const userId = parseInt(id);
    return this.userProfileService.getProfile(userId);
  }

  @Put('profile')
  async updateProfile(@Body('id') id: number, @Body() dto: any) {
    return this.userProfileService.updateProfile(id, dto);
  }

    @Post('forgot-password')
  async forgotPassword(@Body('phone') phone: string, @Body('newPassword') newPassword: string) {
    return this.authService.forgotPassword(phone, newPassword);
  }
}
