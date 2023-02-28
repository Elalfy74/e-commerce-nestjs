import { ProductColor } from '@prisma/client';
import { IsHexColor, IsUUID } from 'class-validator';

export class CreateProductColorDto implements ProductColor {
  @IsUUID(undefined, {
    message: 'Invalid productId!',
  })
  productId: string;

  @IsHexColor()
  color: string;
}
