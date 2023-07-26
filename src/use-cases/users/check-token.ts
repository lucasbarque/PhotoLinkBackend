import { UsersRepository } from '@/repositories/users-repository';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { isBefore } from 'date-fns';
import { TokenExpiratedError } from '@/errors/token-expirated';

interface CheckTokenUseCaseRequest {
  token: string;
}

export class CheckTokenUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ token }: CheckTokenUseCaseRequest) {
    const user = await this.usersRepository.findByToken(token);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    if (isBefore(user.reset_password_expiration!, new Date())) {
      throw new TokenExpiratedError();
    }

    return true;
  }
}
