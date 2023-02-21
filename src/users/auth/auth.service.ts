import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import { CreateUserDto, LoginDto } from '../dtos';
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

  async login({ email, password: hash }: LoginDto) {
    // Check email
    const user = await this.usersService.findOne({ email });
    if (!user) throw new ForbiddenException('Invalid Email or Password');

    // Check Password
    const isEqual = await compare(hash, user.password);
    if (!isEqual) throw new ForbiddenException('Invalid Email or Password');

    // Generate token and send response
    const accessToken = await this.signToken(user.id);

    return {
      accessToken,
      user,
    };
  }

  private async signToken(userId: string) {
    const payload = { sub: userId };
    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
  }
}
