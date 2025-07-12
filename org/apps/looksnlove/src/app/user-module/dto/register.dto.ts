// register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPhoneNumber,
} from 'class-validator';

@Exclude()
export class RegisterDto {
  @ApiProperty({ example: 'Admin', required: true })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty({ example: '9808756808', required: true })
  @IsPhoneNumber()
  phone!: string;

  // @ApiProperty({ example: 'DB0114', required: true })
  // @Expose()
  // @IsString()
  // @IsNotEmpty()
  // readonly emp_id!: string;

  @ApiProperty({ example: '123 Street Name, City, State', required: false })
@Expose()
@IsString()
readonly address?: string;


  @ApiProperty({ example: 'securePassword123', required: true })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly password!: string;

  // @ApiProperty({ example: 1, required: true, description: 'Location name (must match an entry in locations table)' })
  // @Expose()
  // @IsNumber()
  // @IsNotEmpty()
  // readonly workLocation_id!: number;

  @ApiProperty({ example: '43985', required: true })
  @Expose()
  @IsNumber()
  readonly otp!: string;

  @ApiProperty({
    example: 1,
    required: true,
    description: 'Role ID (foreign key)',
  })
  @Expose()
  @IsNumber()
  readonly role_id!: number;

}
