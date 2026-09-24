import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('Users profile (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /users/profile without a token should return 401', () => {
    return request(app.getHttpServer()).get('/users/profile').expect(401);
  });

  it('login then GET /users/profile with the returned token should return 200', async () => {
    // Bước 1: đăng nhập để lấy access_token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'demo@example.com', password: 'Password123!' })
      .expect(200);

    const accessToken: string = loginResponse.body.access_token;
    expect(accessToken).toBeDefined();

    // Bước 2: gắn token vào header Authorization để gọi endpoint được bảo vệ
    const profileResponse = await request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);

    expect(profileResponse.body.user.email).toBe('demo@example.com');
  });
});
