import { User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserDto implements Omit<User, 'password'> {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string;
}
