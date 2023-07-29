import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceAlreadyExistsError } from '@/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { makeFetchGalleriesUseCase } from '@/use-cases/factories/make-fetch-galleries-use-case';

export async function list(request: FastifyRequest, reply: FastifyReply) {
  try {
    const fetchGalleriesQuerySchema = z.object({
      page: z.coerce.number().min(1).default(1),
      perPage: z.coerce.number().min(1).default(10),
    });

    const fetchGalleriesParamsSchema = z.object({
      userId: z.string().uuid(),
    });

    const { userId } = fetchGalleriesParamsSchema.parse(request.params);
    const { page, perPage } = fetchGalleriesQuerySchema.parse(request.query);

    const fetchGalleriesUseCase = makeFetchGalleriesUseCase();

    const galleries = await fetchGalleriesUseCase.execute({
      page,
      perPage,
      userId,
    });

    return reply.status(200).send(galleries);
  } catch (error) {
    if (error instanceof ResourceAlreadyExistsError) {
      return reply.status(406).send({ message: error.message });
    }
    throw error;
  }
}
