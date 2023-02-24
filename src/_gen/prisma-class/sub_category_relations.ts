import { Category } from './category';
import { Product } from './product';
import { ApiProperty } from '@nestjs/swagger';

export class SubCategoryRelations {
  @ApiProperty({ type: () => Category })
  category: Category;

  @ApiProperty({ isArray: true, type: () => Product })
  Products: Product[];
}
