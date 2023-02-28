import { INestApplication } from '@nestjs/common';
import { Category, Product, SubCategory } from '@prisma/client';
import * as request from 'supertest';

import { CreateCategoryDto } from '@/categories/dtos';
import { CreateProductColorDto } from '@/product-colors/dtos';
import { CreateProductDto } from '@/products/dtos';
import { CreateSubcategoryDto } from '@/subcategories/dtos';
import { CreateUserDto } from '@/users/dtos';

// *********** Constants ***********
export const TOKEN = process.env.TOKEN;
export const FAKE_UUID = '65f0580d-b819-4c71-b130-e3e0b22a434c';
export const IMG =
  'https://images.unsplash.com/photo-1677061857086-8175847f19fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80';

// *********** Signup ***********
export const signupDto: CreateUserDto = {
  email: 'email@email.com',
  firstName: 'firstName',
  lastName: 'lastName',
  password: 'password',
};

export function addUserToDB(app: INestApplication) {
  return request(app.getHttpServer()).post('/auth/signup').send(signupDto);
}

// *********** Category ***********
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

// *********** Subcategory ***********
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

export async function addFullSubCategoryToDB(app: INestApplication) {
  const categoryReq = await addCategoryToDB(app);
  const category: Category = categoryReq.body;

  createSubcategoryDto.categoryId = category.id;
  return request(app.getHttpServer())
    .post('/subcategories')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(createSubcategoryDto);
}

// *********** Product ***********
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

export async function addFullProductToDB(app: INestApplication) {
  const subcategoryReq = await addFullSubCategoryToDB(app);
  const subcategory: SubCategory = subcategoryReq.body;

  createProductDto.categoryId = subcategory.categoryId;
  createProductDto.subCategoryName = subcategory.name;
  return request(app.getHttpServer())
    .post('/products')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(createProductDto);
}

// *********** ProductColor ***********
export const createProductColorDto: CreateProductColorDto = {
  color: '000000',
  productId: '',
};

export function addProductColorToDB(app: INestApplication, color?: string) {
  const dto = color
    ? { ...createProductColorDto, color }
    : createProductColorDto;

  return request(app.getHttpServer())
    .post('/product-colors')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(dto);
}

export async function addFullProductColorToDB(app: INestApplication) {
  const productReq = await addFullProductToDB(app);
  const product: Product = productReq.body;

  createProductColorDto.productId = product.id;
  return request(app.getHttpServer())
    .post('/product-colors')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(createProductColorDto);
}
