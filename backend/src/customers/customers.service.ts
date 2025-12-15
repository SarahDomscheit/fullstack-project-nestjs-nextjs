import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create.customer.dto';
import { UpdateCustomerDto } from './dto/update.customer.dto';
import * as bcrypt from 'bcrypt';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOneCustomer(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }
    return customer;
  }

  async findCustomerByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { email },
    });
    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }
    return customer;
  }

  findAllForUser(userId: string) {
    return this.customerRepository.find({ where: { ownerId: userId } });
  }

  async updateForUser(userId: string, id: string, dto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: { id, ownerId: userId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }
    Object.assign(customer, dto);
    return this.customerRepository.save(customer);
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const customer = this.customerRepository.create({
      ...dto,
      password: hashedPassword,
    });
    return this.customerRepository.save(customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOneCustomer(id);
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(customer, dto);
    return this.customerRepository.save(customer);
  }

  async delete(id: string): Promise<void> {
    const customerToDelete = await this.customerRepository.delete(id);
    if (customerToDelete.affected === 0) {
      throw new NotFoundException(`Customer with ID: ${id} not found.`);
    }
  }
}
