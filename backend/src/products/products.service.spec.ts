import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

type MockType<T extends object> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

type MockRepo<T = any> = MockType<Repository<T>>;

function createMockRepo(): MockRepo {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };
}

describe('ProductsService (Customer as User)', () => {
  let service: ProductsService;
  let repo: MockRepo<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get(getRepositoryToken(Product));
  });

  it('allows a logged-in customer to create his own product', async () => {
    const customerId = 'customer-1';
    const dto = { name: 'Test', description: 'Desc', price: 9.99 };
    const entity = {
      id: 'p1',
      ...dto,
      ownerId: customerId,
    } as Product;

    repo.create!.mockReturnValue(entity);
    repo.save!.mockResolvedValue(entity);

    const result = await service.createForUser(customerId, dto as any);

    expect(repo.create).toHaveBeenCalledWith({
      ...dto,
      ownerId: customerId,
    });
    expect(repo.save).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  it('deletes only products that belong to the logged-in customer', async () => {
    const customerId = 'customer-1';
    const productId = 'p1';

    repo.delete!.mockResolvedValue({ affected: 1 });

    await service.removeForUser(customerId, productId);

    expect(repo.delete).toHaveBeenCalledWith({
      id: productId,
      ownerId: customerId,
    });
  });

  it('throws NotFoundException when trying to delete another customer’s product', async () => {
    const customerId = 'customer-1';
    const productId = 'p1';

    repo.delete!.mockResolvedValue({ affected: 0 });

    await expect(service.removeForUser(customerId, productId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
