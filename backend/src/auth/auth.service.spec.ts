import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CustomersService } from '../customers/customers.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let customersService: { findByEmail: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    customersService = {
      findByEmail: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CustomersService, useValue: customersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('logs in valid customer and returns token + user', async () => {
    const customer = {
      id: 'c1',
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashedpwd',
    };
    customersService.findByEmail.mockResolvedValue(customer);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await service.login('alice@example.com', 'plain');

    expect(customersService.findByEmail).toHaveBeenCalledWith(
      'alice@example.com',
    );
    expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashedpwd');
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'c1',
      email: 'alice@example.com',
    });
    expect(result).toEqual({
      access_token: 'jwt-token',
      user: {
        id: 'c1',
        name: 'Alice',
        email: 'alice@example.com',
      },
    });
  });

  it('throws UnauthorizedException if customer not found', async () => {
    customersService.findByEmail.mockResolvedValue(null);

    await expect(service.login('unknown@example.com', 'plain')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException if password is wrong', async () => {
    const customer = {
      id: 'c1',
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashedpwd',
    };
    customersService.findByEmail.mockResolvedValue(customer);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('alice@example.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
