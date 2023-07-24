import { prisma } from '@/lib/prisma';
import { UsersRepository } from '../users-repository';
import { IUser } from '@/interfaces/IUser';

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async create(data: IUser.DTOs.Create) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password_hash: data.password,
      },
    });

    return user;
  }
}
