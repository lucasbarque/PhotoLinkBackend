import { UsersRepository } from '@/repositories/users-repository';
import { CheckTokenUseCase } from './check-token';
import PasswordHash from '@/infra/utils/PasswordHash';

interface ForgotPasswordChangeUseCaseRequest {
  token: string;
  password: string;
}

export class ForgotPasswordChangeUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private checkTokenUseCase: CheckTokenUseCase
  ) {}

  async execute({ token, password }: ForgotPasswordChangeUseCaseRequest) {
    await this.checkTokenUseCase.execute({ token });

    const user = await this.usersRepository.findByToken(token);

    await this.usersRepository.update(user!.id, {
      reset_password_expiration: null,
      reset_password_token: null,
      password_hash: await PasswordHash.hash(password),
    });

    return true;
  }
}
