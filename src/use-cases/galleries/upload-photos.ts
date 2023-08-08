import { env } from '@/env';
import GoogleDriveService from '@/infra/services/GoogleDrive';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { GalleriesRepository } from '@/repositories/galleries-repository';

import { IGallery } from '@/interfaces/IGallery';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

interface UploadPhotosUseCaseUseCaseRequest {
  galleryId: string;
  photo: {
    filename: string;
  };
}

export class UploadPhotosUseCase {
  constructor(private galleriesRepository: GalleriesRepository) {}

  async execute({ galleryId, folderId }: UploadPhotosUseCaseUseCaseRequest) {
    const gallery = await this.galleriesRepository.findById(galleryId);

    if (!gallery) {
      throw new ResourceNotFoundError();
    }

    const photosData = (gallery.photos_data as IGallery.PhotosData) ?? null;

    if (photosData?.folderId) {
      const galleryUpdated = await this.galleriesRepository.update(galleryId, {
        // @ts-ignore
        photos_data: {
          folderId,
        },
      });
    }

    return { gallery: null };
  }
}
