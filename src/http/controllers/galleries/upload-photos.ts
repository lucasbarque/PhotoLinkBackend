import { app } from '@/app';
import GoogleDriveService from '@/infra/services/GoogleDrive';
import UploadHandler from '@/infra/utils/UploadHandler';
import { makeFetchGalleriesUseCase } from '@/use-cases/factories/make-fetch-galleries-use-case';
import { makeGetGalleryUseCase } from '@/use-cases/factories/make-get-gallery-use-case';
import { makeUploadPhotosUseCase } from '@/use-cases/factories/make-upload-photos-use-case';
import { logger, pipelineAsync } from '@/utils';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { PrismaGalleriesRepository } from '@/repositories/prisma/prisma-galleries-repository';

import { IGallery } from '@/interfaces/IGallery';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

export async function uploadPhotos(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const uploadPhotosParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const uploadPhotosQuerySchema = z.object({
      socketId: z.string(),
    });

    const { id } = uploadPhotosParamsSchema.parse(request.params);
    const { socketId } = uploadPhotosQuerySchema.parse(request.query);

    const headers = request.headers;
    const redirectTo = headers.origin;

    const googleDriveService = new GoogleDriveService();
    const googleDriveClient = await googleDriveService.getDriveClient();

    const getGalleryUseCase = makeGetGalleryUseCase();

    const { gallery } = await getGalleryUseCase.execute({
      id,
    });

    const photosData = gallery.photos_data as IGallery.PhotosData;

    const galleriesRepository = new PrismaGalleriesRepository();

    const uploadHandler = new UploadHandler(
      app.io,
      socketId,
      googleDriveClient,
      photosData.folderId,
      gallery.id,
      galleriesRepository
    );

    const onFinish = () => () => {
      logger.info('On FINISH');
      app.io.to(socketId).emit('upload-finished');
    };

    const busboyInstance = uploadHandler.registerEvents(headers, onFinish());
    await pipelineAsync(request.raw, busboyInstance);

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
