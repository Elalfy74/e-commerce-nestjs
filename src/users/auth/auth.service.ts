import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../dtos';
import { UsersService } from '../users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const accessToken = await this.signToken(user.id);

    return {
      accessToken,
      user,
    };
  }

  login() {}

  private async signToken(userId: string) {
    const payload = { sub: userId };
    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
  }
}
