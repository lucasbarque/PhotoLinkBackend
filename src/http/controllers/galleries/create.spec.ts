import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Login (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to login', async () => {
    await request(app.server).post('/users/create').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions/login').send({
      email: 'johndoe@example.com',
      password: '123456',
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
