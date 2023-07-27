import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './env';
import { usersRoutes } from './http/controllers/users/routes';
import { sessionsRoutes } from './http/controllers/sessions/routes';

export const app = fastify();

app.register(fastifyMultipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50mb
  },
});

app.register(cors, {
  origin: env.ALLOWED_ORIGINS.split(','),
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});
app.register(fastifyCookie);
app.register(usersRoutes);
app.register(sessionsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }
  return reply.status(500).send({ message: 'Internal server error.' });
});
