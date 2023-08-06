import { env } from '@/env';
import GoogleDriveService from '@/infra/services/GoogleDrive';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { GalleriesRepository } from '@/repositories/galleries-repository';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

interface UploadPhotosUseCaseUseCaseRequest {
  galleryId: string;
  socketId: string;
  photos: any;
}

export class UploadPhotosUseCase {
  constructor(private galleriesRepository: GalleriesRepository) {}

  private async uploadFile(googleDriveClient: any, file: any) {
    const filename = randomUUID();

    const fileMetadata = {
      name: filename,
      parents: [env.GOOGLE_GALLERIES_FOLDER],
    };

    const arquivo = await sharp(await file.toBuffer());

    const media = {
      mimeType: file.mimetype,
      body: arquivo,
    };

    const response = await googleDriveClient.files.create({
      // @ts-ignore
      resource: fileMetadata,
      media,
      field: 'id',
    });

    console.log(response);
  }

  async execute({
    galleryId,
    photos,
    socketId,
  }: UploadPhotosUseCaseUseCaseRequest) {
    const gallery = await this.galleriesRepository.findById(galleryId);

    if (!gallery) {
      throw new ResourceNotFoundError();
    }

    // try {
    //   const googleDriveService = new GoogleDriveService();
    //   const googleDriveClient = await googleDriveService.getDriveClient();

    //   const uploadPromises: Promise<void>[] = [];

    //   for await (const file of photos) {
    //     const uploadPromise = this.uploadFile(googleDriveClient, file);
    //     uploadPromises.push(uploadPromise);
    //   }
    //   await Promise.all(uploadPromises);
    // } catch (error) {
    //   console.log(error);
    // }
    return { gallery: null };
  }
}
