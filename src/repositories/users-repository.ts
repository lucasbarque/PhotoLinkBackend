import { User } from '@prisma/client';

import { IUser } from '@/interfaces/IUser';

export interface UsersRepository {
  findById(id: string): Promise<IUser.Entity | User | null>;
  findByEmail(email: string): Promise<IUser.Entity | User | null>;
  findByToken(token: string): Promise<IUser.Entity | User | null>;
  create(data: IUser.DTOs.Create): Promise<IUser.Entity | User>;
  update(
    id: string,
    data: IUser.DTOs.Edit
  ): Promise<IUser.Entity | User | null>;
}
