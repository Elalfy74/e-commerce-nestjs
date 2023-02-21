import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { omit, pick } from 'lodash';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateUserDto, LoginDto } from '../src/users/dtos';

describe('Users Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const signupDto: CreateUserDto = {
    email: 'email@email.com',
    firstName: 'firstName',
    lastName: 'lastName',
    password: 'password',
  };

  const loginDto: LoginDto = pick(signupDto, ['email', 'password']);

  function addUserToDB() {
    return request(app.getHttpServer()).post('/auth/signup').send(signupDto);
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

  describe('/auth', () => {
    describe('/signup', () => {
      it('Should return 201 ,token and user without password', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(signupDto);

        expect(res.statusCode).toBe(201);
        expect(res.body.user).toMatchObject(omit(signupDto, 'password'));
        expect(res.body.user).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('accessToken');
      });

      it('Should return 400 if invalid body is sent', async () => {
        const inValidDto = { ...signupDto, email: 'invalid_email' };

        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(inValidDto);

        expect(res.statusCode).toBe(400);
      });

      it('Should return 403 if email already registered', async () => {
        await addUserToDB();

        const res = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(signupDto);

        expect(res.statusCode).toBe(403);
      });
    });

    describe('/login', () => {
      beforeEach(async () => {
        await addUserToDB();
      });

      it('Should return 200 ,token and user without password', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toMatchObject(omit(signupDto, 'password'));
        expect(res.body.user).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('accessToken');
      });

      it('Should return 400 if invalid body is sent', async () => {
        const inValidDto = { ...loginDto, email: 'invalid_email' };

        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send(inValidDto);

        expect(res.statusCode).toBe(400);
      });

      it('Should return 403 if wrong email is provided', async () => {
        const inValidDto = { ...loginDto, email: 'wrong@email.com' };

        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send(inValidDto);

        expect(res.statusCode).toBe(403);
      });

      it('Should return 403 if correct email but wrong password is provided', async () => {
        const inValidDto = { ...loginDto, password: 'wrong_password' };

        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send(inValidDto);

        expect(res.statusCode).toBe(403);
      });
    });
  });
});
