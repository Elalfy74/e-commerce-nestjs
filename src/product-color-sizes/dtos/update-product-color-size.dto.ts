import { PartialType } from '@nestjs/swagger';

import { CreateProductColorSizeDto } from './create-product-color-size.dto';

export class UpdateProductColorSizeDto extends PartialType(
  CreateProductColorSizeDto,
) {}
