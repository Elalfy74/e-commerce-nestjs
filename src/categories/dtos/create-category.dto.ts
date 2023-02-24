import { Category } from '@prisma/client';
import { IsString, IsUrl, MinLength } from 'class-validator';

export class CreateCategoryDto implements Omit<Category, 'id'> {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(4)
  description: string;

  @IsUrl()
  img: string;
}
