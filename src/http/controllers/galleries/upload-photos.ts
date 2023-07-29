import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { makeChangeAvatarUseCase } from '@/use-cases/factories/make-change-avatar-use-case';
import { makeResetPasswordTokenUseCase } from '@/use-cases/factories/make-reset-password-token-use-case';
import { makeUploadPhotosUseCase } from '@/use-cases/factories/make-upload-photos-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function uploadPhotos(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const uploadPhotosParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = uploadPhotosParamsSchema.parse(request.params);

    const files = request.files();

    // if (!photos) {
    //   return reply.status(400).send({
    //     message: 'Photos is required',
    //   });
    // }

    const uploadPhotosUseCase = makeUploadPhotosUseCase();

    await uploadPhotosUseCase.execute({ galleryId: id, photos: files });

    return reply.status(200).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: 'Gallery not found',
      });
    }
    return reply.status(400).send(error);
  }
}
