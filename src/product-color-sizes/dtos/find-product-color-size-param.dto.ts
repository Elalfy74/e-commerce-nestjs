import { OmitType } from '@nestjs/swagger';

import { CreateProductColorSizeDto } from './create-product-color-size.dto';

export class FindProductColorSizeParamDto extends OmitType(
  CreateProductColorSizeDto,
  ['quantity'],
) {}
