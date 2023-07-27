import { LoginUseCase } from '@/use-cases/sessions/login';

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeLoginUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const loginUseCase = new LoginUseCase(prismaUsersRepository);

  return loginUseCase;
}
