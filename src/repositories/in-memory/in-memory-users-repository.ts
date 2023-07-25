import { Role } from '@prisma/client';
import { GetResult } from '@prisma/client/runtime/library';
import { randomUUID } from 'node:crypto';

import { UsersRepository } from '@/repositories/users-repository';

import { IUser } from '@/interfaces/IUser';

export class InMemoryUsersRepository implements UsersRepository {
  public items: IUser.Entity[] = [];

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);
    if (!user) {
      return null;
    }
    return user;
  }

  async create(data: IUser.DTOs.Create) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password_hash: data.password,
      role: IUser.UserRoles.MEMBER,
      created_at: new Date(),
    };
    this.items.push(user);
    return user;
  }

  async update(id: string, data: IUser.DTOs.Edit) {
    const userIndex = this.items.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      return null;
    }

    const updatedUser = Object.assign({}, this.items[userIndex], data);
    this.items[userIndex] = updatedUser;

    return updatedUser;
  }
}
