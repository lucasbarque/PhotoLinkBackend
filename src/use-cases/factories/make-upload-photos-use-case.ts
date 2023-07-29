import { PrismaGalleriesRepository } from '@/repositories/prisma/prisma-galleries-repository';
import { UploadPhotosUseCase } from '../galleries/upload-photos';

export function makeUploadPhotosUseCase() {
  const prismaGalleriesRepository = new PrismaGalleriesRepository();

  const useCase = new UploadPhotosUseCase(prismaGalleriesRepository);

  return useCase;
}
