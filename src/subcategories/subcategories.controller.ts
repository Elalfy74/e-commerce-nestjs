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

import { SubCategory } from '@/_gen/prisma-class/sub_category';
import { AdminGuard, JwtGuard } from '@/common/guards';

import {
  CreateSubcategoryDto,
  FindSubcategoryParamDto,
  UpdateSubcategoryDto,
} from './dtos';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
@ApiTags('SubCategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: SubCategory,
  })
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  @ApiOkResponse({
    type: [SubCategory],
  })
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(':categoryId/:name')
  @ApiOkResponse({
    type: SubCategory,
  })
  findOne(@Param() param: FindSubcategoryParamDto) {
    return this.subcategoriesService.findOne(param);
  }

  @Patch(':categoryId/:name')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: SubCategory,
  })
  update(
    @Param() param: FindSubcategoryParamDto,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(param, updateSubcategoryDto);
  }

  @Delete(':categoryId/:name')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: SubCategory,
  })
  remove(@Param() param: FindSubcategoryParamDto) {
    return this.subcategoriesService.remove(param);
  }
}
