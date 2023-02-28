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

import { ProductColorSize } from '@/_gen/prisma-class/product_color_size';
import { AdminGuard, JwtGuard } from '@/common/guards';

import {
  CreateProductColorSizeDto,
  FindProductColorSizeParamDto,
  UpdateProductColorSizeDto,
} from './dtos';
import { ProductColorSizesService } from './product-color-sizes.service';

@Controller('product-color-sizes')
@ApiTags('ProductColorSizes')
export class ProductColorSizesController {
  constructor(
    private readonly productColorSizesService: ProductColorSizesService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ProductColorSize,
  })
  create(@Body() createProductColorSizeDto: CreateProductColorSizeDto) {
    return this.productColorSizesService.create(createProductColorSizeDto);
  }

  @Get()
  @ApiOkResponse({
    type: [ProductColorSize],
  })
  findAll() {
    return this.productColorSizesService.findAll();
  }

  @Get(':productId/:color/:size')
  @ApiOkResponse({
    type: ProductColorSize,
  })
  findOne(@Param() param: FindProductColorSizeParamDto) {
    return this.productColorSizesService.findOne(param);
  }

  @Patch(':productId/:color/:size')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProductColorSize,
  })
  update(
    @Param() param: FindProductColorSizeParamDto,
    @Body() updateProductColorSizeDto: UpdateProductColorSizeDto,
  ) {
    return this.productColorSizesService.update(
      param,
      updateProductColorSizeDto,
    );
  }

  @Delete(':productId/:color/:size')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProductColorSize,
  })
  remove(@Param() param: FindProductColorSizeParamDto) {
    return this.productColorSizesService.remove(param);
  }
}
