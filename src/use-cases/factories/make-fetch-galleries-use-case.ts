import { PrismaGalleriesRepository } from '@/repositories/prisma/prisma-galleries-repository';
import { FetchGalleriesUseCase } from '../galleries/fetch-galleries';

export function makeFetchGalleriesUseCase() {
  const prismaGalleriesRepository = new PrismaGalleriesRepository();

  const useCase = new FetchGalleriesUseCase(prismaGalleriesRepository);

  return useCase;
}
