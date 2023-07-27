import { FastifyInstance } from 'fastify';
import { register } from './register';
import { authenticate } from './authenticate';
import { refresh } from './refresh';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { profile } from './profile';
import { resetPasswordToken } from './reset-password-token';
import { checkToken } from './check-token';
import { forgotPasswordChange } from './forgot-password-change';

export async function usersRoutes(app: FastifyInstance) {
  // Public routes
  app.post('/users', register);
  app.post('/sessions', authenticate);
  app.patch('/token/refresh', refresh);
  app.post('/forgot-password/token', resetPasswordToken);
  app.post('/forgot-password/change', forgotPasswordChange);
  app.post('/check-token', checkToken);

  app.get('/me', { onRequest: [verifyJWT] }, profile);
}
