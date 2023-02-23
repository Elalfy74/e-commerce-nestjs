import { IsString, IsUrl, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1)
  name: string;

  @IsString()
  @Length(4)
  description: string;

  @IsUrl()
  img: string;
}
