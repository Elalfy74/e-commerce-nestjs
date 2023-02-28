import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { CreateCategoryDto, UpdateCategoryDto } from '@/categories/dtos';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthResponseDto } from '@/users/dtos';

import {
  addCategoryToDB,
  addUserToDB,
  createCategoryDto,
  FAKE_UUID,
  TOKEN,
} from './utils';

describe('Categories Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: AuthResponseDto;

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

    const res = await addUserToDB(app);
    user = res.body;
  });

  afterAll(async () => {
    await prisma.cleanDb();
    app.close();
  });

  afterEach(async () => {
    await prisma.category.deleteMany();
  });

  describe('POST /categories', () => {
    let token: string;
    let dto: CreateCategoryDto;

    const exec = () => {
      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(dto);
    };

    beforeEach(() => {
      token = TOKEN;
      dto = createCategoryDto;
    });

    it('Should return 201 and the new category', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject(createCategoryDto);
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
      dto = { ...createCategoryDto, img: 'invalid_url' };

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 403 if name already exist', async () => {
      await addCategoryToDB(app);

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /categories', () => {
    const exec = () => {
      return request(app.getHttpServer()).get('/categories');
    };

    it('Should return 200 and empty array', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('Should return 200 and all categories', async () => {
      await addCategoryToDB(app);
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('GET /categories/:id', () => {
    let id: string;

    const exec = () => {
      return request(app.getHttpServer()).get(`/categories/${id}`);
    };

    beforeEach(async () => {
      const res = await addCategoryToDB(app);
      id = res.body.id;
    });

    it('Should return 200 and the category', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(createCategoryDto);
    });

    it('Should return 400 if invalid id type is passed', async () => {
      id = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if category not found', async () => {
      id = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /categories/:id', () => {
    let token: string;
    let dto: UpdateCategoryDto;
    let id: string;

    const exec = () => {
      return request(app.getHttpServer())
        .patch(`/categories/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dto);
    };

    beforeEach(async () => {
      token = TOKEN;
      dto = { ...createCategoryDto, name: 'new_name' };
      const res = await addCategoryToDB(app);
      id = res.body.id;
    });

    it('Should return 200 and the new category', async () => {
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

    it('Should return 400 if invalid id type is passed', async () => {
      id = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if category not found', async () => {
      id = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });

    it('Should return 400 if invalid body is sent', async () => {
      dto = { ...dto, img: 'invalid_url' };

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 403 if name already exist', async () => {
      const name = 'dup';
      await addCategoryToDB(app, name);
      dto.name = name;

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /categories/:id', () => {
    let token: string;
    let id: string;

    const exec = () => {
      return request(app.getHttpServer())
        .delete(`/categories/${id}`)
        .set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      token = TOKEN;
      const res = await addCategoryToDB(app);
      id = res.body.id;
    });

    it('Should return 200 and the category', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(createCategoryDto);

      const findRes = await request(app.getHttpServer()).get(
        `/categories/${id}`,
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

    it('Should return 400 if invalid id type is passed', async () => {
      id = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if category not found', async () => {
      id = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });
});
