import { FastifyInstance } from 'fastify';
import { login } from './login';
import { refresh } from './refresh';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { profile } from './profile';

export async function sessionsRoutes(app: FastifyInstance) {
  app.get('/sessions/me', { onRequest: [verifyJWT] }, profile);

  app.post('/sessions/login', login);
  app.patch('/sessions/refresh-token', refresh);
}
