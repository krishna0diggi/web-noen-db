// ✅ 2. create-appoinment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

const DURATION_OPTIONS = ['30min', '45min', '1hr', '1hr 30min', '2hr'];

export class CreateAppointmentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty({ example: [1, 2], description: 'List of service IDs' })
  @IsArray()
  @IsNotEmpty()
  serviceIds!: number[];

  @ApiProperty({ example: '2025-07-04' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: '11:30' })
  @IsString()
  @IsNotEmpty()
  time!: string;

  @ApiProperty({ example: '1hr' })
  @IsIn(DURATION_OPTIONS)
  duration!: string;

  @ApiProperty({ example: 599.0 })
  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @ApiPropertyOptional({ example: 'Please use herbal shampoo only.' })
  @IsOptional()
  @IsString()
  specialPreferences?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Invalid WhatsApp number' })
  whatsappNumber?: string;
}
