import { PrismaGalleriesRepository } from '@/repositories/prisma/prisma-galleries-repository';

import { GetGalleryUseCase } from '../galleries/get-gallery';

export function makeGetGalleryUseCase() {
  const prismaGalleriesRepository = new PrismaGalleriesRepository();

  const useCase = new GetGalleryUseCase(prismaGalleriesRepository);

  return useCase;
}
