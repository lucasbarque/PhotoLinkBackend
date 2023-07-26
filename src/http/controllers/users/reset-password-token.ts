import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { makeResetPasswordTokenUseCase } from '@/use-cases/factories/make-reset-password-token-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function resetPasswordToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const resetPasswordTokenBodySchema = z.object({
      email: z.string().email(),
    });

    const { email } = resetPasswordTokenBodySchema.parse(request.body);

    const getResetPasswordToken = makeResetPasswordTokenUseCase();

    await getResetPasswordToken.execute({
      email,
    });

    return reply.status(200).send({
      message: 'E-mail sent successfully',
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(200).send({
        message: 'E-mail sent successfully',
      });
    }
  }
}
