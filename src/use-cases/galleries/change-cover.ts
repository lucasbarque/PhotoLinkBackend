import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

import { randomUUID } from 'node:crypto';
import { env } from '@/env';
import GoogleDriveService from '@/infra/services/GoogleDrive';
import { GalleriesRepository } from '@/repositories/galleries-repository';
import { IGallery } from '@/interfaces/IGallery';
import sharp from 'sharp';

interface ChangeAvatarUseCaseRequest {
  id: string;
  cover: any;
}

export class ChangeCoverUseCase {
  constructor(private galleriesRepository: GalleriesRepository) {}

  async execute({ id, cover }: ChangeAvatarUseCaseRequest) {
    const gallery = await this.galleriesRepository.findById(id);

    if (!gallery) {
      throw new ResourceNotFoundError();
    }

    const photosData = (gallery.photos_data as IGallery.PhotosData) ?? null;
    const file = await sharp(await cover.toBuffer());

    try {
      const googleDriveService = new GoogleDriveService();
      const googleDriveClient = await googleDriveService.getDriveClient();

      if (photosData?.cover?.id) {
        await googleDriveClient.files
          .get({
            fileId: photosData.cover.id,
          })
          .then(async ({ data }) => {
            await googleDriveClient.files.delete({
              fileId: data.id!,
            });
          });
      }

      const filename = randomUUID();

      const fileMetadata = {
        name: filename,
        parents: [env.GOOGLE_GALLERIES_COVER_FOLDER],
      };

      const media = {
        mimeType: cover.mimetype,
        body: file,
      };

      const response = await googleDriveClient.files.create({
        // @ts-ignore
        resource: fileMetadata,
        media,
        field: 'id',
      });

      const galleryUpdated = await this.galleriesRepository.update(id, {
        // @ts-ignore
        photos_data: {
          cover: {
            // @ts-ignore
            id: response.data.id,
            filename,
          },
        },
      });
      return { gallery: galleryUpdated };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
