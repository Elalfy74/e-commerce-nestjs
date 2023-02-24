import { Product } from './product';
import { ProductColorSizes } from './product_color_sizes';
import { ProductColorImg } from './product_color_img';
import { ApiProperty } from '@nestjs/swagger';

export class ProductColorRelations {
  @ApiProperty({ type: () => Product })
  product: Product;

  @ApiProperty({ isArray: true, type: () => ProductColorSizes })
  ProductColorSizes: ProductColorSizes[];

  @ApiProperty({ isArray: true, type: () => ProductColorImg })
  ProductColorImgs: ProductColorImg[];
}
