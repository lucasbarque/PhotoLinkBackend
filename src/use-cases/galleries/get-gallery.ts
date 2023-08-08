import { GalleriesRepository } from '@/repositories/galleries-repository';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

interface GetGalleryUseCaseRequest {
  id: string;
}

export class GetGalleryUseCase {
  constructor(private galleriesRepository: GalleriesRepository) {}

  async execute({ id }: GetGalleryUseCaseRequest) {
    const gallery = await this.galleriesRepository.findById(id);

    if (!gallery) {
      throw new ResourceNotFoundError();
    }

    return { gallery };
  }
}
