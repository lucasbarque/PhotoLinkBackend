import { PrismaGalleriesRepository } from '@/repositories/prisma/prisma-galleries-repository';
import { ChangeCoverUseCase } from '../galleries/change-cover';

export function makeChangeGalleryCoverUseCase() {
  const prismaGalleriesRepository = new PrismaGalleriesRepository();

  const useCase = new ChangeCoverUseCase(prismaGalleriesRepository);

  return useCase;
}
