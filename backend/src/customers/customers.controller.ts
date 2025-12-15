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

@Controller('customers')
export class CustomersController {
  constructor(private readonly userService: CustomersService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(`:id`)
  findOneUser(@Param(`id`) id: string) {
    return this.userService.findOneCustomer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`:id`)
  update(@Param(`id`) id: string, @Body() dto: UpdateCustomerDto) {
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`:id`)
  delete(@Param(`id`) id: string) {
    return this.userService.delete(id);
  }
}
