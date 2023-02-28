import { IsInt, IsString, Length } from 'class-validator';

import { CreateProductColorDto } from '@/product-colors/dtos';

export class CreateProductColorSizeDto extends CreateProductColorDto {
  @IsString()
  @Length(1, 4)
  size: string;

  @IsInt()
  quantity: number;
}
