import { PartialType } from '@nestjs/swagger';

import { CreateProductColorImgDto } from './create-product-color-img.dto';

export class UpdateProductColorImgDto extends PartialType(
  CreateProductColorImgDto,
) {}
