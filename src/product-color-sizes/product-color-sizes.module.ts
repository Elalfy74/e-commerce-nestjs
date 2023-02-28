import { Module } from '@nestjs/common';

import { ProductColorSizesController } from './product-color-sizes.controller';
import { ProductColorSizesService } from './product-color-sizes.service';

@Module({
  controllers: [ProductColorSizesController],
  providers: [ProductColorSizesService],
})
export class ProductColorSizesModule {}
