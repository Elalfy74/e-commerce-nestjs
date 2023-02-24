import { IsUUID } from 'class-validator';

export class IdParamDto {
  @IsUUID(undefined, {
    message: 'Invalid id type',
  })
  id: string;
}
