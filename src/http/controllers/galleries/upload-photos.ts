import UploadHandler from '@/infra/utils/UploadHandler';
import { makeChangeAvatarUseCase } from '@/use-cases/factories/make-change-avatar-use-case';
import { makeResetPasswordTokenUseCase } from '@/use-cases/factories/make-reset-password-token-use-case';
import { makeUploadPhotosUseCase } from '@/use-cases/factories/make-upload-photos-use-case';
import { logger, pipelineAsync } from '@/utils';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

export async function uploadPhotos(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const uploadPhotosParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const uploadPhotosBodySchema = z.object({
      socketId: z.object({
        value: z.string(),
      }),
    });

    const { id } = uploadPhotosParamsSchema.parse(request.params);
    const requestBody = uploadPhotosBodySchema.parse(request.body);
    const socketId = requestBody.socketId.value;

    const headers = request.headers;
    const redirectTo = headers.origin;

    const files = request.files();

    const uploadPhotosUseCase = makeUploadPhotosUseCase();

    const uploadHandler = new UploadHandler(request.socket, socketId);

    const onFinish = (reply: FastifyReply, redirectTo: string) => () => {
      return reply
        .header('Connection', 'close')
        .header('Location', `${redirectTo}?msg=Files uploaded with success!`)
        .status(303)
        .send();
    };

    const busboyInstance = uploadHandler.registerEvents(
      headers,
      onFinish(reply, redirectTo + '/galleries/' + id)
    );

    // const responseData = await uploadPhotosUseCase.execute({
    //   galleryId: id,
    //   photos: files,
    //   socketId,
    // });

    await pipelineAsync(request.files(), busboyInstance);

    logger.info('Request finished with success!');

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
