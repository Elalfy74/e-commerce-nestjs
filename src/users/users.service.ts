import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // Check for email duplication
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) throw new ForbiddenException('Email is already registered!');

    // Hash password and create user
    createUserDto.password = await hash(password, 12);

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findOne(identifier: { id: string } | { email: string }) {
    return this.prisma.user.findUnique({
      where: identifier,
    });
  }
}
