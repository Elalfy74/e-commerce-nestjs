import { IsString, IsUUID, MinLength } from 'class-validator';

export class FindSubcategoryParamDto {
  @IsUUID(undefined, {
    message: 'Invalid categoryId',
  })
  categoryId: string;

  @IsString()
  @MinLength(1)
  name: string;
}
