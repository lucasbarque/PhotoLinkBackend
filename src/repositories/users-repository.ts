import { IUser } from '@/interfaces/IUser';
import { User } from '@prisma/client';

export interface UsersRepository {
  findById(id: string): Promise<IUser.Entity | User | null>;
  findByEmail(email: string): Promise<IUser.Entity | User | null>;
  create(data: IUser.DTOs.Create): Promise<IUser.Entity | User>;
}
