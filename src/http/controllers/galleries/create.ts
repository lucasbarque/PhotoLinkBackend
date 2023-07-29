import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeCreateGalleryUseCase } from '@/use-cases/factories/make-create-gallery-use-case';
import { ResourceAlreadyExistsError } from '@/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const CreateGalleryBodySchema = z.object({
      title: z.string(),
      userId: z.string().uuid(),
    });

    const { title, userId } = CreateGalleryBodySchema.parse(request.body);

    const createGalleryUseCase = makeCreateGalleryUseCase();

    const { gallery } = await createGalleryUseCase.execute({
      title,
      user_id: userId,
    });

    return reply.status(201).send(gallery);
  } catch (error) {
    if (error instanceof ResourceAlreadyExistsError) {
      return reply.status(406).send({ message: error.message });
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
