import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangeAvatarUseCase } from '../users/change-avatar';

export function makeChangeAvatarUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const loginUseCase = new ChangeAvatarUseCase(prismaUsersRepository);

  return loginUseCase;
}
