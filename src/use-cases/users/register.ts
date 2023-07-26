import { UsersRepository } from '@/repositories/users-repository';

import { IUser } from '@/interfaces/IUser';

import { ResourceAlreadyExistsError } from '@/errors/resource-already-exists-error';
import PasswordHash from '@/infra/utils/PasswordHash';

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, phone, password }: IUser.DTOs.Create) {
    const password_hash = await PasswordHash.hash(password);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ResourceAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      password: password_hash,
    });

    return { user };
  }
}
