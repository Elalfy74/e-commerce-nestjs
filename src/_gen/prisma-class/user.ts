import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiPropertyOptional({ type: String })
  avatar?: string;
}
