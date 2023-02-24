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
import { CreateSubcategoryDto, UpdateSubcategoryDto } from './dtos';
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
  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.subcategoriesService.findOne(id);
  }

  @ApiOkResponse({
    description: 'The subcategory data',
    type: SubCategory,
  })
  @Patch(':id')
  update(
    @Param() { id }: IdParamDto,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  @ApiOkResponse({
    description: 'The subcategory data',
    type: SubCategory,
  })
  @Delete(':id')
  remove(@Param() { id }: IdParamDto) {
    return this.subcategoriesService.remove(id);
  }
}
