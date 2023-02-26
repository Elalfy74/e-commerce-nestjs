import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
} from '../src/subcategories/dtos';
import { AuthResponseDto } from '../src/users/dtos';
import { addCategoryToDB, addUserToDB, FAKE_UUID, IMG, TOKEN } from './utils';

describe('Subcategories Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: AuthResponseDto;
  let category: Category;

  const createSubcategoryDto: CreateSubcategoryDto = {
    name: 'Subcategory',
    description: 'Desc',
    img: IMG,
    categoryId: '',
  };

  function addSubCategoryToDB(name?: string) {
    const dto = name ? { ...createSubcategoryDto, name } : createSubcategoryDto;
    return request(app.getHttpServer())
      .post('/subcategories')
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

    const userRes = await addUserToDB(app);
    user = userRes.body;

    const catRes = await addCategoryToDB(app);
    category = catRes.body;
    createSubcategoryDto.categoryId = category.id;
  });

  afterAll(async () => {
    await prisma.cleanDb();
    app.close();
  });

  afterEach(async () => {
    await prisma.subCategory.deleteMany();
  });

  describe('POST /subcategories', () => {
    let token: string;
    let dto: CreateSubcategoryDto;

    const exec = () => {
      return request(app.getHttpServer())
        .post('/subcategories')
        .set('Authorization', `Bearer ${token}`)
        .send(dto);
    };

    beforeEach(() => {
      token = TOKEN;
      dto = { ...createSubcategoryDto };
    });

    it('Should return 201 and the new subcategory', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject(createSubcategoryDto);
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
      dto = { ...createSubcategoryDto, img: 'invalid_url' };

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 403 if name already exist', async () => {
      await addSubCategoryToDB();

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });

    it('Should return 403 if invalid categoryId is passed', async () => {
      dto.categoryId = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /subcategories', () => {
    const exec = () => {
      return request(app.getHttpServer()).get('/subcategories');
    };

    it('Should return 200 and empty array', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('Should return 200 and all subcategories', async () => {
      await addSubCategoryToDB();
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('GET /subcategories/:categoryId/:name', () => {
    let categoryId: string;
    let name: string;

    const exec = () => {
      return request(app.getHttpServer()).get(
        `/subcategories/${categoryId}/${name}`,
      );
    };

    beforeEach(async () => {
      const res = await addSubCategoryToDB();
      categoryId = res.body.categoryId;
      name = res.body.name;
    });

    it('Should return 200 and the subcategory', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(createSubcategoryDto);
    });

    it('Should return 400 if invalid categoryId type is passed', async () => {
      categoryId = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if subcategory not found', async () => {
      categoryId = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /subcategories', () => {
    let token: string;
    let dto: UpdateSubcategoryDto;
    let categoryId: string;
    let name: string;

    const exec = () => {
      return request(app.getHttpServer())
        .patch(`/subcategories/${categoryId}/${name}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dto);
    };

    beforeEach(async () => {
      token = TOKEN;
      dto = { ...createSubcategoryDto, name: 'new_name' };
      const res = await addSubCategoryToDB();
      categoryId = res.body.categoryId;
      name = res.body.name;
    });

    it('Should return 200 and the new subcategory', async () => {
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

    it('Should return 400 if invalid categoryId type is passed', async () => {
      categoryId = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if subcategory not found', async () => {
      categoryId = FAKE_UUID;

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
      await addSubCategoryToDB(name);
      dto.name = name;

      const res = await exec();
      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /categories/:id', () => {
    let token: string;
    let categoryId: string;
    let name: string;

    const exec = () => {
      return request(app.getHttpServer())
        .delete(`/subcategories/${categoryId}/${name}`)
        .set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      token = TOKEN;
      const res = await addSubCategoryToDB();
      categoryId = res.body.categoryId;
      name = res.body.name;
    });

    it('Should return 200 and the subcategory', async () => {
      const res = await exec();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(createSubcategoryDto);

      const findRes = await request(app.getHttpServer()).get(
        `/subcategories/${categoryId}/${name}`,
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

    it('Should return 400 if invalid categoryId type is passed', async () => {
      categoryId = 'wrong_id';

      const res = await exec();
      expect(res.statusCode).toBe(400);
    });

    it('Should return 404 if category not found', async () => {
      categoryId = FAKE_UUID;

      const res = await exec();
      expect(res.statusCode).toBe(404);
    });
  });
});
