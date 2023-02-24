import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { CreateUserDto } from '../src/users/dtos';

export const signupDto: CreateUserDto = {
  email: 'email@email.com',
  firstName: 'firstName',
  lastName: 'lastName',
  password: 'password',
};

export function addUserToDB(app: INestApplication) {
  return request(app.getHttpServer()).post('/auth/signup').send(signupDto);
}
