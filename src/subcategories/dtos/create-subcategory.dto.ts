import { SubCategory } from '@prisma/client';
import { IsString, IsUrl, IsUUID, MinLength } from 'class-validator';

export class CreateSubcategoryDto implements Omit<SubCategory, 'id'> {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(4)
  description: string;

  @IsUrl()
  img: string;

  @IsUUID(undefined, {
    message: 'Invalid categoryId',
  })
  categoryId: string;
}
