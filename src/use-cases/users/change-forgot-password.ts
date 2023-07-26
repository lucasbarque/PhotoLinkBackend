import { UsersRepository } from '@/repositories/users-repository';
import { CheckTokenUseCase } from './check-token';
import PasswordHash from '@/infra/utils/PasswordHash';

interface ChangeForgotPasswordUseCaseRequest {
  token: string;
  password: string;
}

export class ChangeForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private checkTokenUseCase: CheckTokenUseCase
  ) {}

  async execute({ token, password }: ChangeForgotPasswordUseCaseRequest) {
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
