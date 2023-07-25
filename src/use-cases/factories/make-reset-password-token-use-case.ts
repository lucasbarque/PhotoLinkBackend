import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetResetPasswordTokenUseCase } from '../users/get-reset-password-token';

export function makeResetPasswordTokenUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const useCase = new GetResetPasswordTokenUseCase(prismaUsersRepository);

  return useCase;
}
