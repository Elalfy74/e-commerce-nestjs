import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  desc: string;

  @ApiProperty({ type: String })
  coverImg: string;

  @ApiProperty({ type: Number })
  currentPrice: number;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiPropertyOptional({ type: Number })
  avgRating?: number;

  @ApiProperty({ type: String })
  subCategoryId: string;
}
