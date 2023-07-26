import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CheckTokenUseCase } from '../users/check-token';

export function makeCheckTokenUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const useCase = new CheckTokenUseCase(prismaUsersRepository);

  return useCase;
}
