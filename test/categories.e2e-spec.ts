import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CreateCategoryDto, UpdateCategoryDto } from '../src/categories/dtos';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthResponseDto } from '../src/users/dtos';
import { addUserToDB } from './utils';

describe('Categories Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: AuthResponseDto;
  const TOKEN = process.env.TOKEN;

  const createCategoryDto: CreateCategoryDto = {
    name: 'category',
    description: 'description',
    img: 'https://images.unsplash.com/photo-1677061857086-8175847f19fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  };

  function addCategoryToDB(name?: string) {
    const dto = name ? { ...createCategoryDto, name } : createCategoryDto;

    return request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(dto);
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

    const res = await addUserToDB(app);
    user = res.body;
  });

  afterAll(() => {
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
      await addCategoryToDB();

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
      await addCategoryToDB();
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
      const res = await addCategoryToDB();
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
      id = '65f0580d-b819-4c71-b130-e3e0b22a434c';

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /categories', () => {
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
      const res = await addCategoryToDB();
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
      id = '65f0580d-b819-4c71-b130-e3e0b22a434c';

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
      await addCategoryToDB(name);
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
      const res = await addCategoryToDB();
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
      id = '65f0580d-b819-4c71-b130-e3e0b22a434c';

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });
});
