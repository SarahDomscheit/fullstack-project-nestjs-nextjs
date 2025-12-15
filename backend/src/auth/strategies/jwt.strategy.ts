import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private customersService: CustomersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || `default_secret`,
    });
  }

  async validate(payload: any) {
    const user = await this.customersService.findOneCustomer(payload.sub);
    if (!user) {
      throw new UnauthorizedException(`User not found`);
    }
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
