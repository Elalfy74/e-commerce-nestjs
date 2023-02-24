import { ApiProperty } from '@nestjs/swagger';

export class ProductColorSizes {
  @ApiProperty({ type: String })
  productId: string;

  @ApiProperty({ type: String })
  color: string;

  @ApiProperty({ type: String })
  size: string;
}
