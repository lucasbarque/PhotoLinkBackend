import { FastifyInstance } from 'fastify';
import { register } from './register';
import { resetPasswordToken } from './reset-password-token';
import { checkToken } from './check-token';
import { forgotPasswordChange } from './forgot-password-change';
import { changeAvatar } from './change-avatar';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { getAvatar } from './get-avatar';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users/create', register);
  app.post('/users/forgot-password/get-token', resetPasswordToken);
  app.post('/users/forgot-password/check-token', checkToken);
  app.post('/users/forgot-password/change', forgotPasswordChange);

  app.get('/users/get-avatar/:id', getAvatar);

  app.patch(
    '/users/change-avatar/:id',
    { onRequest: [verifyJWT] },
    changeAvatar
  );
}
