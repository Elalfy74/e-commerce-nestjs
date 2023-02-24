import { ApiProperty } from '@nestjs/swagger';

export class ProductColorImg {
  @ApiProperty({ type: String })
  productId: string;

  @ApiProperty({ type: String })
  color: string;

  @ApiProperty({ type: String })
  img: string;
}
