import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

type MockType<T extends object> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

type MockRepo<T = any> = MockType<Repository<T>>;

function createMockRepo(): MockRepo {
  return {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };
}

jest.mock('bcrypt');

describe('CustomersService (Customer as User)', () => {
  let service: CustomersService;
  let repo: MockRepo<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repo = module.get(getRepositoryToken(Customer));
  });

  it('creates a customer (user) and hashes the password', async () => {
    const dto = {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'plain',
    };
    const hashed = 'hashedpwd';
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);

    const entity = {
      id: 'c1',
      name: dto.name,
      email: dto.email,
      password: hashed,
      orderIds: [],
    } as Customer;

    repo.create!.mockReturnValue(entity);
    repo.save!.mockResolvedValue(entity);

    const result = await service.create(dto as any);

    expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
    expect(repo.create).toHaveBeenCalledWith({
      ...dto,
      password: hashed,
    });
    expect(repo.save).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  it('finds a customer by email', async () => {
    const email = 'alice@example.com';
    const customer = { id: 'c1', email } as Customer;
    repo.findOne!.mockResolvedValue(customer);

    const result = await service.findByEmail(email);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { email } });
    expect(result).toEqual(customer);
  });

  it('finds a customer by id or throws', async () => {
    const id = 'c1';
    const customer = { id, name: 'Alice' } as Customer;
    repo.findOne!.mockResolvedValue(customer);

    const result = await service.findOne(id);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(customer);

    repo.findOne!.mockResolvedValue(null);

    await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
  });

  it('updates a customer (user profile)', async () => {
    const id = 'c1';
    const existing = {
      id,
      name: 'Old',
      email: 'old@example.com',
      password: 'hashedpwd',
    } as Customer;
    repo.findOne!.mockResolvedValue(existing);
    repo.save!.mockImplementation((c) => Promise.resolve(c));

    const result = await service.update(id, { name: 'New' } as any);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(repo.save).toHaveBeenCalled();
    expect(result.name).toBe('New');
  });

  it('throws NotFoundException when updating non-existing customer', async () => {
    repo.findOne!.mockResolvedValue(null);

    await expect(
      service.update('unknown', { name: 'New' } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('removes a customer or throws if not found', async () => {
    const id = 'c1';

    repo.delete!.mockResolvedValueOnce({ affected: 1 });

    await service.remove(id);
    expect(repo.delete).toHaveBeenCalledWith(id);

    repo.delete!.mockResolvedValueOnce({ affected: 0 });

    await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  });
});
