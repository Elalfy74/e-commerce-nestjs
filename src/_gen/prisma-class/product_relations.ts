import { SubCategory } from './sub_category';
import { ProductColor } from './product_color';
import { ApiProperty } from '@nestjs/swagger';

export class ProductRelations {
  @ApiProperty({ type: () => SubCategory })
  subCategory: SubCategory;

  @ApiProperty({ isArray: true, type: () => ProductColor })
  ProductColors: ProductColor[];
}
