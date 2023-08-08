import { makeGetGalleryUseCase } from '@/use-cases/factories/make-get-gallery-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

export async function getGallery(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getGalleryParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getGalleryParamsSchema.parse(request.params);

    const getGalleryUseCase = makeGetGalleryUseCase();

    const { gallery } = await getGalleryUseCase.execute({
      id,
    });

    return reply.status(200).send(gallery);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
