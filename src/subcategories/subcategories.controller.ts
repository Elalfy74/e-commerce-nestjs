import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SubCategory } from '../_gen/prisma-class/sub_category';
import { IdParamDto } from '../common/dtos';
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
  @ApiCreatedResponse({
    description: 'The subcategory data',
    type: SubCategory,
  })
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The all subcategories data',
    type: [SubCategory],
  })
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @ApiOkResponse({
    description: 'The subcategory data',
    type: SubCategory,
  })
  @Get(':categoryId/:name')
  findOne(@Param() param: FindSubcategoryParamDto) {
    return this.subcategoriesService.findOne(param);
  }

  @ApiOkResponse({
    description: 'The subcategory data',
    type: SubCategory,
  })
  @Patch(':categoryId/:name')
  update(
    @Param() param: FindSubcategoryParamDto,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(param, updateSubcategoryDto);
  }

  @ApiOkResponse({
    description: 'The subcategory data',
    type: SubCategory,
  })
  @Delete(':categoryId/:name')
  remove(@Param() param: FindSubcategoryParamDto) {
    return this.subcategoriesService.remove(param);
  }
}
