import { ProductColor } from './product_color';
import { ApiProperty } from '@nestjs/swagger';

export class ProductColorSizeRelations {
  @ApiProperty({ type: () => ProductColor })
  ProductColor: ProductColor;
}
