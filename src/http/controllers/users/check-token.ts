import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { TokenExpiratedError } from '@/errors/token-expirated';
import { makeCheckTokenUseCase } from '@/use-cases/factories/make-check-token-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function checkToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const checkTokenBodySchema = z.object({
      token: z.string(),
    });

    const { token } = checkTokenBodySchema.parse(request.body);

    const getCheckToken = makeCheckTokenUseCase();

    await getCheckToken.execute({
      token,
    });

    return reply.status(200).send({
      message: 'Token is valid',
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(403).send({
        message: 'Invalid Token',
      });
    }

    if (error instanceof TokenExpiratedError) {
      return reply.status(406).send({
        message: 'Expired Token',
      });
    }

    return reply.status(400).send(error);
  }
}
