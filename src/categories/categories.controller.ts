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

import { Category } from '../_gen/prisma-class/category';
import { IdParamDto } from '../common/dtos';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The category data',
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The all categories data',
    type: [Category],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The category data',
    type: Category,
  })
  findOne(@Param() { id }: IdParamDto) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The category data',
    type: Category,
  })
  update(
    @Param() { id }: IdParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The category data',
    type: Category,
  })
  remove(@Param() { id }: IdParamDto) {
    return this.categoriesService.remove(id);
  }
}
