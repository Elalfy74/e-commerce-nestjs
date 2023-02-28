import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { hash } from 'bcryptjs';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    // Hash password and create user
    try {
      createUserDto.password = await hash(password, 12);

      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Email is already registered!');
        }
      }
      throw e;
    }
  }

  findOne(identifier: { id: string } | { email: string }) {
    return this.prisma.user.findUnique({
      where: identifier,
    });
  }
}
