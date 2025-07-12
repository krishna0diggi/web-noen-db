import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@Exclude()
export class UpdateServiceDto {
  @ApiProperty({ example: 'Lotus WHITEGLOW Facial', required: false })
  @Expose()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'Brightens skin and provides instant glow',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: ['Steaming', 'Glow Massage'],
    required: false,
    type: [String],
  })
  @Expose()
  @IsOptional()
  @IsArray()
  readonly features?: string[];

  @ApiProperty({ example: 1499, required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly price?: number;

  @ApiProperty({ example: 699, required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly discountedPrice?: number;

  @ApiProperty({ example: 45, required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly durationInMinutes?: number;

  @ApiProperty({
    example: 'https://example.com/images/newfacial.jpg',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiProperty({ example: 2, required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  readonly categoryId?: number;

  @ApiProperty({ example: true, required: false })
  @Expose()
  @IsOptional()
  @IsBoolean()
  readonly isAvailable?: boolean;
}
