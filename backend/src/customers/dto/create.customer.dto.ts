import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  orderIds?: number[];
}
