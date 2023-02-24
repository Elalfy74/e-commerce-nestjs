import { ApiProperty } from '@nestjs/swagger';

export class SubCategory {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  img: string;

  @ApiProperty({ type: String })
  categoryId: string;
}
