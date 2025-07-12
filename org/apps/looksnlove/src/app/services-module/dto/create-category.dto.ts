import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CreateCategoryDto {
    @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Facials', required: true })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

   @ApiProperty({ example: 'facials', description: 'URL-safe slug for routing' })
  @Expose()
  @IsString()
  @IsNotEmpty()
   slug!: string;

  @ApiProperty({
    example: 'Skin treatment to improve appearance and health',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  readonly description?: string;
}
