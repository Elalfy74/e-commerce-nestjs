import { ApiProperty } from '@nestjs/swagger';

export class ProductColorSize {
  @ApiProperty({ type: String })
  productId: string;

  @ApiProperty({ type: String })
  color: string;

  @ApiProperty({ type: String })
  size: string;

  @ApiProperty({ type: Number })
  quantity: number;
}
