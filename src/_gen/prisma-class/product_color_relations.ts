import { Product } from './product';
import { ProductColorSize } from './product_color_size';
import { ProductColorImg } from './product_color_img';
import { ApiProperty } from '@nestjs/swagger';

export class ProductColorRelations {
  @ApiProperty({ type: () => Product })
  product: Product;

  @ApiProperty({ isArray: true, type: () => ProductColorSize })
  ProductColorSizes: ProductColorSize[];

  @ApiProperty({ isArray: true, type: () => ProductColorImg })
  ProductColorImgs: ProductColorImg[];
}
