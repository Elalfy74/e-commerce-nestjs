import { Module } from '@nestjs/common';

import { ProductColorsController } from './product-colors.controller';
import { ProductColorsService } from './product-colors.service';

@Module({
  controllers: [ProductColorsController],
  providers: [ProductColorsService],
})
export class ProductColorsModule {}
