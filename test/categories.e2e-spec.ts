import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { omit, pick } from 'lodash';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CreateCategoryDto } from '../src/categories/dto';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Categories Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const createCategoryDto: CreateCategoryDto = {
    name: 'category',
    description: 'description',
    img: 'https://images.unsplash.com/photo-1677061857086-8175847f19fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  };

  function addCategoryToDB() {
    return request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto);
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  afterEach(async () => {
    await prisma.cleanDb();
  });

  describe('/categories', () => {
    it('Should return 201 and the new category', async () => {
      const res = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject(createCategoryDto);
      expect(res.body).toHaveProperty('id');
    });

    it('Should return 400 if invalid body is sent', async () => {
      const inValidDto = { ...createCategoryDto, img: 'invalid_url' };

      const res = await request(app.getHttpServer())
        .post('/categories')
        .send(inValidDto);

      expect(res.statusCode).toBe(400);
    });

    it('Should return 403 if name already exist', async () => {
      await addCategoryToDB();

      const res = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto);

      expect(res.statusCode).toBe(403);
    });
  });
});
