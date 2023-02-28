import { Module } from '@nestjs/common';

import { ProductColorImgsController } from './product-color-imgs.controller';
import { ProductColorImgsService } from './product-color-imgs.service';

@Module({
  controllers: [ProductColorImgsController],
  providers: [ProductColorImgsService],
})
export class ProductColorImgsModule {}
