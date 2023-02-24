import { User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserDto implements Omit<User, 'password' | 'isAdmin'> {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
