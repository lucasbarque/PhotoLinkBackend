import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ForgotPasswordChangeUseCase } from '../users/forgot-password-change';
import { CheckTokenUseCase } from '../users/check-token';

export function makeForgotPasswordChangeUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const checkTokenUseCase = new CheckTokenUseCase(prismaUsersRepository);

  const useCase = new ForgotPasswordChangeUseCase(
    prismaUsersRepository,
    checkTokenUseCase
  );

  return useCase;
}
