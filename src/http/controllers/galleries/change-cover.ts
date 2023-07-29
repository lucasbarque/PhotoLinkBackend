import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { makeChangeAvatarUseCase } from '@/use-cases/factories/make-change-avatar-use-case';
import { makeChangeGalleryCoverUseCase } from '@/use-cases/factories/make-change-gallery-cover-use-case';
import { makeResetPasswordTokenUseCase } from '@/use-cases/factories/make-reset-password-token-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function changeCover(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const changeCoverParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = changeCoverParamsSchema.parse(request.params);

    const cover = await request.file();

    if (!cover) {
      return reply.status(400).send({
        message: 'Cover is required',
      });
    }

    const changeCoverUseCase = makeChangeGalleryCoverUseCase();

    const gallery = await changeCoverUseCase.execute({
      id,
      cover,
    });

    return reply.status(200).send(gallery);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: 'Gallery not found',
      });
    }
    return reply.status(400).send(error);
  }
}
