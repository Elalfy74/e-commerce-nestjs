import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductColorDto,
  FindProductColorParamDto,
  UpdateProductColorDto,
} from './dtos';

@Injectable()
export class ProductColorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductColorDto: CreateProductColorDto) {
    try {
      return await this.prisma.productColor.create({
        data: createProductColorDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new ForbiddenException('Invalid productId!');
        }
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'this color already exist related to this product!',
          );
        }
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.productColor.findMany();
  }

  async findOne(param: FindProductColorParamDto) {
    const productColor = await this.prisma.productColor.findUnique({
      where: {
        productId_color: param,
      },
    });
    if (!productColor) throw new NotFoundException('Product Color Not Found!');
    return productColor;
  }

  async update(
    param: FindProductColorParamDto,
    updateProductColorDto: UpdateProductColorDto,
  ) {
    try {
      return await this.prisma.productColor.update({
        where: {
          productId_color: param,
        },
        data: updateProductColorDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Product Color Not Found!');
        }
        if (e.code === 'P2003') {
          throw new ForbiddenException('Invalid productId!');
        }
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'this color already exist related to this product!',
          );
        }
      }
      throw e;
    }
  }

  async remove(param: FindProductColorParamDto) {
    try {
      return await this.prisma.productColor.delete({
        where: {
          productId_color: param,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Product Color Not Found!');
        }
      }
      throw e;
    }
  }
}
