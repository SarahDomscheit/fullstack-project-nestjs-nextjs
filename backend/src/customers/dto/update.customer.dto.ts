import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  orderIds?: number[];
}
