import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('LoginController', () => {
  let app: INestApplication;
  const loginService = { signUp: jest.fn(), signIn: jest.fn() };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: loginService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /login/sign-up', () => {
    it('should fail validation if email is not valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/login/sign-up')
        .send({
          email: 'invalid-email',
          password: 'validPassword',
          name: 'test',
          gender: 'male',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email must be an email');
    });

    it('should fail validation if password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/login/sign-up')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('password should not be empty');
    });

    it('should pass validation with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/login/sign-up')
        .send({
          email: 'test@example.com',
          password: 'validPassword',
          name: 'test',
          gender: 'male',
        });

      expect(response.status).toBe(201);
      expect(loginService.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'validPassword',
        name: 'test',
        gender: 'male',
      });
    });
  });

  describe('POST /login/sign-in', () => {
    it('should success if email and password are valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/login/sign-in')
        .send({ email: 'test@example.com', password: 'validPassword' });

      expect(response.status).toBe(200);
      expect(loginService.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'validPassword',
      });
    });
  });
});
