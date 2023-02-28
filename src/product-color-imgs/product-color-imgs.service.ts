import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from '@/prisma/prisma.service';

import {
  CreateProductColorImgDto,
  FindProductColorImgParamDto,
  UpdateProductColorImgDto,
} from './dtos';

@Injectable()
export class ProductColorImgsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductColorImgDto: CreateProductColorImgDto) {
    try {
      return await this.prisma.productColorImg.create({
        data: createProductColorImgDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new ForbiddenException('Invalid productId or color!');
        }
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'this img already exist related to this product color!',
          );
        }
      }
      throw e;
    }
  }
  findAll() {
    return this.prisma.productColorImg.findMany();
  }

  async findOne(param: FindProductColorImgParamDto) {
    const productColorImg = await this.prisma.productColorImg.findUnique({
      where: {
        productId_color_img: param,
      },
    });
    if (!productColorImg)
      throw new NotFoundException('Product Color Img Not Found!');
    return productColorImg;
  }

  async update(
    param: FindProductColorImgParamDto,
    updateProductColorImgDto: UpdateProductColorImgDto,
  ) {
    try {
      return await this.prisma.productColorImg.update({
        where: {
          productId_color_img: param,
        },
        data: updateProductColorImgDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Product Color Img Not Found!');
        }
        if (e.code === 'P2003') {
          throw new ForbiddenException('Invalid productId or color!');
        }
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'this img already exist related to this color!',
          );
        }
      }
      throw e;
    }
  }

  async remove(param: FindProductColorImgParamDto) {
    try {
      return await this.prisma.productColorImg.delete({
        where: {
          productId_color_img: param,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Product Color Img Not Found!');
        }
      }
      throw e;
    }
  }
}
