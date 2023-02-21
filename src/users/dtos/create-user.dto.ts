import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1)
  firstName: string;

  @Length(1)
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @Length(6)
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
