import { IsNumber, IsString, IsUrl, IsUUID, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(4)
  desc: string;

  @IsUrl()
  coverImg: string;

  @IsNumber()
  currentPrice: number;

  @IsUUID(undefined, {
    message: 'Invalid categoryId',
  })
  categoryId: string;

  @IsString()
  @MinLength(1)
  subCategoryName: string;
}
