import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SubCategory } from '@prisma/client';
import { omit } from 'lodash';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '../src/products/dtos';
import { setup } from '../src/setup';
import { AuthResponseDto } from '../src/users/dtos';
import {
  addCategoryToDB,
  addProductToDB,
  addSubCategoryToDB,
  addUserToDB,
  createProductDto,
  createSubcategoryDto,
  FAKE_UUID,
  TOKEN,
} from './utils';

describe('Products Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: AuthResponseDto;
  let subCategory: SubCategory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    setup(app);

    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    // Register user
    const res = await addUserToDB(app);
    user = res.body;

    // Create Category
    const categoryRes = await addCategoryToDB(app);
    const category = categoryRes.body;

    // Create Subcategory
    createSubcategoryDto.categoryId = category.id;
    const subCatRes = await addSubCategoryToDB(app);
    subCategory = subCatRes.body;

    // Configure Product Dto
    createProductDto.categoryId = subCategory.categoryId;
    createProductDto.subCategoryName = subCategory.name;
  });

  afterAll(async () => {
    await prisma.cleanDb();
    app.close();
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
  });

  describe('POST /products', () => {
    let token: string;
    let dto: CreateProductDto;

    const exec = () => {
      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(dto);
    };

    beforeEach(() => {
      token = TOKEN;
      dto = createProductDto;
    });

    it('Should return 201 and the new product', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject(omit(createProductDto, 'currentPrice'));
      expect(res.body).toHaveProperty('id');
    });

    it('Should return 401 if no token is provided', async () => {
      token = null;

      const res = await exec();
      expect(res.statusCode).toBe(401);
    });

    it('Should return 403 if token is provided but role is not admin ', async () => {
      token = user.accessToken;

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });

    it('Should return 400 if invalid body is sent', async () => {
      dto = { ...createProductDto, coverImg: 'invalid_url' };

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 403 if name categoryId is wrong', async () => {
      dto = { ...createProductDto, categoryId: FAKE_UUID };

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });

    it('Should return 403 if name categoryId is right but subCategoryName is wrong', async () => {
      dto = { ...createProductDto, subCategoryName: 'Any_Name' };

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /products', () => {
    const exec = () => {
      return request(app.getHttpServer()).get('/products');
    };

    it('Should return 200 and empty array', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('Should return 200 and all products', async () => {
      await addProductToDB(app);
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('GET /products/:id', () => {
    let id: string;

    const exec = () => {
      return request(app.getHttpServer()).get(`/products/${id}`);
    };

    beforeEach(async () => {
      const res = await addProductToDB(app);
      id = res.body.id;
    });

    it('Should return 200 and the product', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(omit(createProductDto, 'currentPrice'));
    });

    it('Should return 400 if invalid id type is passed', async () => {
      id = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if product not found', async () => {
      id = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /products/:id', () => {
    let token: string;
    let dto: UpdateProductDto;
    let id: string;

    const exec = () => {
      return request(app.getHttpServer())
        .patch(`/products/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dto);
    };

    beforeEach(async () => {
      token = TOKEN;
      dto = { ...createProductDto, title: 'new_title' };
      const res = await addProductToDB(app);
      id = res.body.id;
    });

    it('Should return 200 and the new product', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(omit(dto, 'currentPrice'));
    });

    it('Should return 401 if no token is provided', async () => {
      token = null;

      const res = await exec();
      expect(res.statusCode).toBe(401);
    });

    it('Should return 403 if token is provided but role is not admin ', async () => {
      token = user.accessToken;

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });

    it('Should return 400 if invalid id type is passed', async () => {
      id = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if product not found', async () => {
      id = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });

    it('Should return 400 if invalid body is sent', async () => {
      dto = { ...dto, coverImg: 'invalid_img' };

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 403 if name categoryId is wrong', async () => {
      dto = { ...createProductDto, categoryId: FAKE_UUID };

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });

    it('Should return 403 if name categoryId is right but subCategoryName is wrong', async () => {
      dto = { ...createProductDto, subCategoryName: 'Any_Name' };

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /products/:id', () => {
    let token: string;
    let id: string;

    const exec = () => {
      return request(app.getHttpServer())
        .delete(`/products/${id}`)
        .set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      token = TOKEN;
      const res = await addProductToDB(app);
      id = res.body.id;
    });

    it('Should return 200 and the product', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(omit(createProductDto, 'currentPrice'));

      const findRes = await request(app.getHttpServer()).get(`/products/${id}`);
      expect(findRes.statusCode).toBe(404);
    });

    it('Should return 401 if no token is provided', async () => {
      token = null;

      const res = await exec();
      expect(res.statusCode).toBe(401);
    });

    it('Should return 403 if token is provided but role is not admin ', async () => {
      token = user.accessToken;

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });

    it('Should return 400 if invalid id type is passed', async () => {
      id = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if product not found', async () => {
      id = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });
});
