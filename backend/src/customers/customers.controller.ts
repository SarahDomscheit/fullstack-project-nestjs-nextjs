import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Public } from 'src/public/decorators/public.decorator';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create.customer.dto';
import { UpdateCustomerDto } from './dto/update.customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly userService: CustomersService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Customer[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(`:id`)
  findOneUser(@Param(`id`) id: string): Promise<Customer> {
    return this.userService.findOneCustomer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`:id`)
  update(
    @Param(`id`) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`:id`)
  delete(@Param(`id`) id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
