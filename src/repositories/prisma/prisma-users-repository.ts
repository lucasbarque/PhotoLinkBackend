import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { GetResult } from '@prisma/client/runtime/library';

import { UsersRepository } from '@/repositories/users-repository';

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

  async update(id: string, data: IUser.DTOs.Edit) {
    return await prisma.user.update({ data, where: { id } });
  }
}
