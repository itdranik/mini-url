import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Ping responses with OK', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK);
  });

  it('Generating a short URL', async () => {
    const shortUrlResponse = await request(app.getHttpServer())
      .post('/')
      .set('Accept', 'application/json')
      .send({ originalUrl: 'https://example.com' });

    const shortUrl = shortUrlResponse.text.substr('localhost:3000/'.length);
    return request(app.getHttpServer()).get(`/${shortUrl}`).expect(HttpStatus.FOUND);
  });
});
