import { ProductColor } from './product_color';
import { ApiProperty } from '@nestjs/swagger';

export class ProductColorImgRelations {
  @ApiProperty({ type: () => ProductColor })
  productColor: ProductColor;
}
