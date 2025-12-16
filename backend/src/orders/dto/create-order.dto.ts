import { IsArray, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @IsNumber()
  totalPrice: number;

  @IsUUID()
  customerId: string;
}
