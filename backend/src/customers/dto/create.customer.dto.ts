import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
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
}
