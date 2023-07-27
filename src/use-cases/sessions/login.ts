import { compare } from 'bcryptjs';

import { UsersRepository } from '@/repositories/users-repository';

import { InvalidCredentialsError } from '@/errors/invalid-credentials-error';

interface LoginUseCaseRequest {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: LoginUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
