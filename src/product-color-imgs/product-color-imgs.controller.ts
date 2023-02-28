import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductColorImg } from '@/_gen/prisma-class/product_color_img';
import { AdminGuard, JwtGuard } from '@/common/guards';

import {
  CreateProductColorImgDto,
  FindProductColorImgParamDto,
  UpdateProductColorImgDto,
} from './dtos';
import { ProductColorImgsService } from './product-color-imgs.service';

@Controller('product-color-imgs')
@ApiTags('ProductColorImgs')
export class ProductColorImgsController {
  constructor(
    private readonly productColorImgsService: ProductColorImgsService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ProductColorImg,
  })
  create(@Body() createProductColorImgDto: CreateProductColorImgDto) {
    return this.productColorImgsService.create(createProductColorImgDto);
  }

  @Get()
  @ApiOkResponse({
    type: [ProductColorImg],
  })
  findAll() {
    return this.productColorImgsService.findAll();
  }

  @Get(':productId/:color/:img')
  @ApiOkResponse({
    type: ProductColorImg,
  })
  findOne(@Param() param: FindProductColorImgParamDto) {
    return this.productColorImgsService.findOne(param);
  }

  @Patch(':productId/:color/:img')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProductColorImg,
  })
  update(
    @Param() param: FindProductColorImgParamDto,
    @Body() updateProductColorImgDto: UpdateProductColorImgDto,
  ) {
    return this.productColorImgsService.update(param, updateProductColorImgDto);
  }

  @Delete(':productId/:color/:img')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProductColorImg,
  })
  remove(@Param() param: FindProductColorImgParamDto) {
    return this.productColorImgsService.remove(param);
  }
}
