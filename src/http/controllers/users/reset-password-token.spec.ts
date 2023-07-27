import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('Reset Password Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to send a password token by email', async () => {
    process.env.ACTIVE_SEND_EMAILS = 'false';

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

    expect(user).toEqual(
      expect.objectContaining({
        reset_password_token: expect.any(String),
        reset_password_expiration: expect.any(Date),
      })
    );
  });
});
