import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaGalleriesRepository } from '@/repositories/prisma/prisma-galleries-repository';
import { CreateGalleryUseCase } from '../galleries/create-gallery';

export function makeCreateGalleryUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const prismaGalleriesRepository = new PrismaGalleriesRepository();

  const useCase = new CreateGalleryUseCase(
    prismaGalleriesRepository,
    prismaUsersRepository
  );

  return useCase;
}
