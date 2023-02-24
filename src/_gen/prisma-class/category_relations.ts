import { SubCategory } from './sub_category';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryRelations {
  @ApiProperty({ isArray: true, type: () => SubCategory })
  SubCategories: SubCategory[];
}
