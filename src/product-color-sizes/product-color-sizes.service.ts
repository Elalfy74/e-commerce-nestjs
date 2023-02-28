import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from '@/prisma/prisma.service';

import {
  CreateProductColorSizeDto,
  FindProductColorSizeParamDto,
  UpdateProductColorSizeDto,
} from './dtos';

@Injectable()
export class ProductColorSizesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductColorSizeDto: CreateProductColorSizeDto) {
    try {
      return await this.prisma.productColorSize.create({
        data: createProductColorSizeDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new ForbiddenException('Invalid productId or color!');
        }
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'this size already exist related to this product color!',
          );
        }
      }
      throw e;
    }
  }
  findAll() {
    return this.prisma.productColorSize.findMany();
  }

  async findOne(param: FindProductColorSizeParamDto) {
    const productColorSize = await this.prisma.productColorSize.findUnique({
      where: {
        productId_color_size: param,
      },
    });
    if (!productColorSize)
      throw new NotFoundException('Product Color Size Not Found!');
    return productColorSize;
  }

  async update(
    param: FindProductColorSizeParamDto,
    updateProductColorSizeDto: UpdateProductColorSizeDto,
  ) {
    try {
      return await this.prisma.productColorSize.update({
        where: {
          productId_color_size: param,
        },
        data: updateProductColorSizeDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Product Color Size Not Found!');
        }
        if (e.code === 'P2003') {
          throw new ForbiddenException('Invalid productId or color!');
        }
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'this Size already exist related to this color!',
          );
        }
      }
      throw e;
    }
  }

  async remove(param: FindProductColorSizeParamDto) {
    try {
      return await this.prisma.productColorSize.delete({
        where: {
          productId_color_size: param,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Product Color Size Not Found!');
        }
      }
      throw e;
    }
  }
}
