import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSubcategoryDto,
  FindSubcategoryParamDto,
  UpdateSubcategoryDto,
} from './dtos';

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
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Subcategory with same name already exist in this category!',
          );
        }
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.subCategory.findMany();
  }

  async findOne(param: FindSubcategoryParamDto) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: {
        categoryId_name: param,
      },
    });
    if (!subCategory) throw new NotFoundException('Subcategory Not Found!');
    return subCategory;
  }

  async update(
    param: FindSubcategoryParamDto,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    try {
      return await this.prisma.subCategory.update({
        where: {
          categoryId_name: param,
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
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Subcategory with same name already exist in this category!',
          );
        }
      }
      throw e;
    }
  }

  async remove(param: FindSubcategoryParamDto) {
    try {
      return await this.prisma.subCategory.delete({
        where: {
          categoryId_name: param,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Subcategory Not Found!');
        }
      }
      throw e;
    }
  }
}
