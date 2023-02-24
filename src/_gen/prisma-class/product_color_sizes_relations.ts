import { ProductColor } from './product_color';
import { ApiProperty } from '@nestjs/swagger';

export class ProductColorSizesRelations {
  @ApiProperty({ type: () => ProductColor })
  ProductColor: ProductColor;
}
