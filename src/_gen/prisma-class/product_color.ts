import { ApiProperty } from '@nestjs/swagger';

export class ProductColor {
  @ApiProperty({ type: String })
  productId: string;

  @ApiProperty({ type: String })
  color: string;
}
