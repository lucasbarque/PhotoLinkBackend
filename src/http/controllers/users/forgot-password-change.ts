import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { TokenExpiratedError } from '@/errors/token-expirated';
import { makeForgotPasswordChangeUseCase } from '@/use-cases/factories/make-forgot-password-change-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function forgotPasswordChange(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const forgotPasswordChangeBodySchema = z.object({
      token: z.string(),
      password: z.string(),
    });

    const { token, password } = forgotPasswordChangeBodySchema.parse(
      request.body
    );

    const forgotPasswordChange = makeForgotPasswordChangeUseCase();

    await forgotPasswordChange.execute({
      password,
      token,
    });

    return reply.status(200).send({
      message: 'Password changed sucessfully',
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
