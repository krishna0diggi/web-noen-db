// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '9808756808', required: true })
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ example: 'securePassword123', required: true })
  @IsString()
  password!: string;
}
