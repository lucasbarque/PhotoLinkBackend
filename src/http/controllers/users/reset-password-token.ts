import { makeResetPasswordTokenUseCase } from '@/use-cases/factories/make-reset-password-token-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function resetPasswordToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
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
}
