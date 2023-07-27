import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('Check Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
    vi.useFakeTimers();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to check a valid token', async () => {
    await request(app.server).post('/users/create').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: '123456',
    });

    await request(app.server).post('/users/forgot-password/get-token').send({
      email: 'johndoe@example.com',
    });

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: 'johndoe@example.com',
      },
    });

    const validateToken = await request(app.server)
      .post('/users/forgot-password/check-token')
      .send({
        token: user.reset_password_token,
      });

    expect(validateToken.statusCode).toEqual(200);
  });

  it('should not be able to check an invalid token', async () => {
    const validateToken = await request(app.server)
      .post('/users/forgot-password/check-token')
      .send({
        token: 'invalid-token',
      });

    expect(validateToken.statusCode).toEqual(403);
  });

  it('should not be able to check a token expired', async () => {
    await request(app.server).post('/users/create').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: '123456',
    });

    vi.setSystemTime(new Date(2023, 0, 1, 8, 0));

    await request(app.server).post('/users/forgot-password/get-token').send({
      email: 'johndoe@example.com',
    });

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: 'johndoe@example.com',
      },
    });

    vi.setSystemTime(new Date(2023, 0, 3, 8, 0));

    const validateToken = await request(app.server)
      .post('/users/forgot-password/check-token')
      .send({
        token: user.reset_password_token,
      });

    expect(validateToken.statusCode).toEqual(406);
  });
});
