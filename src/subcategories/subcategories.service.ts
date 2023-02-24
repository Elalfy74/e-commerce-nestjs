import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSubcategoryDto, UpdateSubcategoryDto } from './dtos';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      return await this.prisma.subCategory.create({
        data: createSubcategoryDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new ForbiddenException('Invalid categoryId!');
        }
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.subCategory.findMany();
  }

  async findOne(id: string) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: {
        id,
      },
    });

    if (!subCategory) throw new NotFoundException('Subcategory Not Found!');
    return subCategory;
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    try {
      return await this.prisma.subCategory.update({
        where: {
          id,
        },
        data: updateSubcategoryDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Subcategory Not Found!');
        }
        if (e.code === 'P2003') {
          throw new ForbiddenException('Invalid categoryId!');
        }
        throw e;
      }
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.subCategory.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Subcategory Not Found!');
        }
        throw e;
      }
    }
  }
}
