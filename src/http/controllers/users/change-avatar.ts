import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { makeChangeAvatarUseCase } from '@/use-cases/factories/make-change-avatar-use-case';
import { makeResetPasswordTokenUseCase } from '@/use-cases/factories/make-reset-password-token-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function changeAvatar(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const changeAvatarParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = changeAvatarParamsSchema.parse(request.params);
    const avatar = await request.file();

    if (!avatar) {
      return reply.status(400).send({
        message: 'Avatar is required',
      });
    }

    const changeAvatarUseCase = makeChangeAvatarUseCase();

    const user = await changeAvatarUseCase.execute({
      id,
      avatar,
    });

    return reply.status(200).send(user);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: 'User not found',
      });
    }
    return reply.status(400).send(error);
  }
}
