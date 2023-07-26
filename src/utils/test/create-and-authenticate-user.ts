import PasswordHash from '@/infra/utils/PasswordHash';
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      phone: '(67) 9 9199-7210',
      email: 'johndoe@example.com',
      password_hash: await PasswordHash.hash('123456'),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return { token };
}
