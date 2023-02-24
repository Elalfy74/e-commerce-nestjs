import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @MinLength(1)
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
