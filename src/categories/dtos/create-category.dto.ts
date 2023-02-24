import { IsString, IsUrl, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(4)
  description: string;

  @IsUrl()
  img: string;
}
