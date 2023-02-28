import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@prisma/client';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateProductColorDto,
  UpdateProductColorDto,
} from '@/product-colors/dtos';
import { setup } from '@/setup';
import { AuthResponseDto } from '@/users/dtos';

import {
  addFullProductToDB,
  addProductColorToDB,
  addUserToDB,
  createProductColorDto,
  FAKE_UUID,
  TOKEN,
} from './utils';

describe('ProductColors Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: AuthResponseDto;

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
    const userRes = await addUserToDB(app);
    user = userRes.body;

    // Create Product
    const productReq = await addFullProductToDB(app);

    // Configure ProductColor
    createProductColorDto.productId = productReq.body.id;
  });

  afterAll(async () => {
    await prisma.cleanDb();
    app.close();
  });

  afterEach(async () => {
    await prisma.productColor.deleteMany();
  });

  describe('POST /product-colors', () => {
    let token: string;
    let dto: CreateProductColorDto;

    const exec = () => {
      return request(app.getHttpServer())
        .post('/product-colors')
        .set('Authorization', `Bearer ${token}`)
        .send(dto);
    };

    beforeEach(() => {
      token = TOKEN;
      dto = { ...createProductColorDto };
    });

    it('Should return 201 and the new product color', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject(createProductColorDto);
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
      dto = { ...createProductColorDto, color: 'ad' };

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 403 if color already exist', async () => {
      await addProductColorToDB(app);

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });

    it('Should return 403 if invalid productId is passed', async () => {
      dto.productId = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /product-colors', () => {
    const exec = () => {
      return request(app.getHttpServer()).get('/product-colors');
    };

    it('Should return 200 and empty array', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('Should return 200 and all products colors', async () => {
      await addProductColorToDB(app);
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('GET /product-colors/:productId/:color', () => {
    let productId: string;
    let color: string;

    const exec = () => {
      return request(app.getHttpServer()).get(
        `/product-colors/${productId}/${color}`,
      );
    };

    beforeEach(async () => {
      const res = await addProductColorToDB(app);
      productId = res.body.productId;
      color = res.body.color;
    });

    it('Should return 200 and the product color', async () => {
      const res = await exec();
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(createProductColorDto);
    });

    it('Should return 400 if invalid productId type is passed', async () => {
      productId = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if Product color not found', async () => {
      productId = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /product-colors/:productId/:color', () => {
    let token: string;
    let dto: UpdateProductColorDto;
    let productId: string;
    let color: string;

    const exec = () => {
      return request(app.getHttpServer())
        .patch(`/product-colors/${productId}/${color}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dto);
    };

    beforeEach(async () => {
      token = TOKEN;
      dto = { ...createProductColorDto, color: 'ffffff' };
      const res = await addProductColorToDB(app);
      productId = res.body.productId;
      color = res.body.color;
    });

    it('Should return 200 and the new product color', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(dto);
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

    it('Should return 400 if invalid productId type is passed', async () => {
      productId = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if product color not found', async () => {
      productId = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });

    it('Should return 400 if invalid body is sent', async () => {
      dto = { ...dto, color: 'nb' };

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 403 if color already exist', async () => {
      const color = 'e3e3e3';
      await addProductColorToDB(app, color);
      dto.color = color;

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /product-colors/:productId/:color', () => {
    let token: string;
    let productId: string;
    let color: string;

    const exec = () => {
      return request(app.getHttpServer())
        .delete(`/product-colors/${productId}/${color}`)
        .set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      token = TOKEN;
      const res = await addProductColorToDB(app);
      productId = res.body.productId;
      color = res.body.color;
    });

    it('Should return 200 and the product color', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(createProductColorDto);

      const findRes = await request(app.getHttpServer()).get(
        `/product-colors/${productId}/${color}`,
      );
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

    it('Should return 400 if invalid productId type is passed', async () => {
      productId = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if product color not found', async () => {
      productId = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });
});
