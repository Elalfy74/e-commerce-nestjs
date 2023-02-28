import { INestApplication } from '@nestjs/common';
import { CreateProductDto } from 'src/products/dtos';
import * as request from 'supertest';

import { CreateCategoryDto } from '../src/categories/dtos';
import { CreateSubcategoryDto } from '../src/subcategories/dtos';
import { CreateUserDto } from '../src/users/dtos';

export const TOKEN = process.env.TOKEN;
export const FAKE_UUID = '65f0580d-b819-4c71-b130-e3e0b22a434c';
export const IMG =
  'https://images.unsplash.com/photo-1677061857086-8175847f19fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80';

export const signupDto: CreateUserDto = {
  email: 'email@email.com',
  firstName: 'firstName',
  lastName: 'lastName',
  password: 'password',
};

export function addUserToDB(app: INestApplication) {
  return request(app.getHttpServer()).post('/auth/signup').send(signupDto);
}

export const createCategoryDto: CreateCategoryDto = {
  name: 'category',
  description: 'description',
  img: IMG,
};

export function addCategoryToDB(app: INestApplication, name?: string) {
  const dto = name ? { ...createCategoryDto, name } : createCategoryDto;

  return request(app.getHttpServer())
    .post('/categories')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(dto);
}

export const createSubcategoryDto: CreateSubcategoryDto = {
  name: 'Subcategory',
  description: 'Desc',
  img: IMG,
  categoryId: '',
};

export function addSubCategoryToDB(app: INestApplication, name?: string) {
  const dto = name ? { ...createSubcategoryDto, name } : createSubcategoryDto;
  return request(app.getHttpServer())
    .post('/subcategories')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(dto);
}

export const createProductDto: CreateProductDto = {
  title: 'product',
  desc: 'Desc',
  coverImg: IMG,
  currentPrice: 2.0,
  categoryId: '',
  subCategoryName: '',
};

export function addProductToDB(app: INestApplication) {
  return request(app.getHttpServer())
    .post('/products')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(createProductDto);
}
