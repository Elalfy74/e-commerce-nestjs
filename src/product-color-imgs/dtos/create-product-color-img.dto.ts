import { IsUrl } from 'class-validator';

import { CreateProductColorDto } from '@/product-colors/dtos';

export class CreateProductColorImgDto extends CreateProductColorDto {
  @IsUrl()
  img: string;
}
