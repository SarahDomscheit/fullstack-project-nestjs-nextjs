import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from 'src/customers/customers.service';
import * as bcrypt from 'bcrypt';
import { Customer } from 'src/customers/entities/customer.entity';
import { CreateCustomerDto } from 'src/customers/dto/create.customer.dto';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async validateCustomer(email: string, password: string): Promise<any> {
    const customer = await this.customersService.findCustomerByEmail(email);
    if (customer && (await bcrypt.compare(password, customer.password))) {
      const { password, ...result } = customer;
      return result;
    }
    return null;
  }

  async register(dto: CreateCustomerDto) {
    const customer = await this.customersService.create(dto);

    const payload = { sub: customer.id, email: customer.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    };
  }

  async login(email: string, password: string) {
    const customer = await this.validateCustomer(email, password);

    const payload = { sub: customer.id, email: customer.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    };
  }
}
