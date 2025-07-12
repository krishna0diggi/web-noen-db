import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@Exclude()
export class CreateServiceDto {
  @ApiProperty({ example: 'VLCC Gold Facial', required: true })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty({
    example: 'Provides golden glow and skin rejuvenation',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: ['Steaming', 'Blackhead Removal', 'Massage'],
    type: [String],
    required: true,
  })
  @Expose()
  @IsArray()
  readonly features!: string[];

  @ApiProperty({ example: 1699, required: true })
  @Expose()
  @IsNumber()
  @Min(0)
  readonly price!: number;

  @ApiProperty({ example: 699, required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly discountedPrice?: number;

  @ApiProperty({ example: 60, required: true })
  @Expose()
  @IsNumber()
  @Min(1)
  readonly durationInMinutes!: number;

  @ApiProperty({
    example: 'https://example.com/images/facial.jpg',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiProperty({ example: 2, required: true })
  @Expose()
  @IsNumber()
  readonly categoryId!: number;
}
