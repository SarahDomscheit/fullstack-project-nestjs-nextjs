import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let repositoryMock: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repositoryMock = module.get(getRepositoryToken(Order));
  });

  it('should create and save an order', async () => {
    // Arrange
    const createOrderDto = {
      productIds: ['prod-1', 'prod-2'],
      totalPrice: 29.99,
      customerId: 'cust-123',
    };
    const orderEntity = { id: 'order-1', ...createOrderDto };

    repositoryMock.create.mockReturnValue(orderEntity as any);
    repositoryMock.save.mockResolvedValue(orderEntity as any);

    // Act
    const result = await service.create(createOrderDto as any);

    // Assert
    expect(repositoryMock.create).toHaveBeenCalledWith(createOrderDto);
    expect(repositoryMock.save).toHaveBeenCalled();
    expect(result).toEqual(orderEntity);
  });

  it('should throw NotFoundException if order does not exist', async () => {
    // Arrange
    repositoryMock.findOne.mockResolvedValue(null as any);

    // Act & Assert
    await expect(service.findOne('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
    expect(repositoryMock.findOne).toHaveBeenCalledWith({ id: 'nonexistent' });
  });
});
