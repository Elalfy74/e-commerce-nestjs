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

import { ProductColor } from '@/_gen/prisma-class/product_color';
import { AdminGuard, JwtGuard } from '@/common/guards';

import {
  CreateProductColorDto,
  FindProductColorParamDto,
  UpdateProductColorDto,
} from './dtos';
import { ProductColorsService } from './product-colors.service';

@Controller('product-colors')
@ApiTags('ProductColors')
export class ProductColorsController {
  constructor(private readonly productColorsService: ProductColorsService) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ProductColor,
  })
  create(@Body() createProductColorDto: CreateProductColorDto) {
    return this.productColorsService.create(createProductColorDto);
  }

  @Get()
  @ApiOkResponse({
    type: [ProductColor],
  })
  findAll() {
    return this.productColorsService.findAll();
  }

  @Get(':productId/:color')
  @ApiOkResponse({
    type: ProductColor,
  })
  findOne(@Param() param: FindProductColorParamDto) {
    return this.productColorsService.findOne(param);
  }

  @Patch(':productId/:color')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProductColor,
  })
  update(
    @Param() param: FindProductColorParamDto,
    @Body() updateProductColorDto: UpdateProductColorDto,
  ) {
    return this.productColorsService.update(param, updateProductColorDto);
  }

  @Delete(':productId/:color')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProductColor,
  })
  remove(@Param() param: FindProductColorParamDto) {
    return this.productColorsService.remove(param);
  }
}
