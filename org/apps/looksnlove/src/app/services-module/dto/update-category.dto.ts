import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class UpdateCategoryDto {
  @ApiProperty({ example: 'Threading', required: false })
  @Expose()
  @IsOptional()
  @IsString()
  readonly name?: string;
  
     @ApiProperty({ example: 'facials', description: 'URL-safe slug for routing' })
    @Expose()
    @IsString()
    @IsNotEmpty()
     slug!: string;

  @ApiProperty({
    example: 'Hair removal service using thread',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  readonly description?: string;
}
