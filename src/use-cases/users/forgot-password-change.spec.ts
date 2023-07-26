import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

import { GetResetPasswordTokenUseCase } from './get-reset-password-token';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { TokenExpiratedError } from '@/errors/token-expirated';
import { CheckTokenUseCase } from './check-token';
import PasswordHash from '@/infra/utils/PasswordHash';
import { compare } from 'bcryptjs';
import { ForgotPasswordChangeUseCase } from './forgot-password-change';

let usersRepository: InMemoryUsersRepository;
let checkTokenUseCase: CheckTokenUseCase;
let getResetPasswordTokenUseCase: GetResetPasswordTokenUseCase;
let sut: ForgotPasswordChangeUseCase;

describe('Forgot Password Change Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getResetPasswordTokenUseCase = new GetResetPasswordTokenUseCase(
      usersRepository
    );
    checkTokenUseCase = new CheckTokenUseCase(usersRepository);
    sut = new ForgotPasswordChangeUseCase(usersRepository, checkTokenUseCase);
    vi.useFakeTimers();
  });

  it('should be able to change a user password', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: await PasswordHash.hash('123456'),
    });

    process.env.ACTIVE_SEND_EMAILS = 'false';

    const { token } = await getResetPasswordTokenUseCase.execute({
      email: createdUser.email,
    });

    if (token) {
      const response = await sut.execute({
        token,
        password: '1234567',
      });

      const user = await usersRepository.findById(createdUser.id);
      const isPasswordChanged = await compare('1234567', user!.password_hash);

      expect(isPasswordChanged).toBeTruthy();
      expect(response).toBeTruthy();
    }
  });

  it('should not be able to change a user password with invalid token', async () => {
    await expect(() =>
      sut.execute({
        token: 'invalid-token',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to change a user password with expired token', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: await PasswordHash.hash('123456'),
    });

    process.env.ACTIVE_SEND_EMAILS = 'false';

    vi.setSystemTime(new Date(2023, 0, 1, 8, 0));

    const { token } = await getResetPasswordTokenUseCase.execute({
      email: createdUser.email,
    });

    vi.setSystemTime(new Date(2023, 0, 3, 8, 0));

    if (token) {
      await expect(() =>
        sut.execute({
          token,
          password: '1234567',
        })
      ).rejects.toBeInstanceOf(TokenExpiratedError);
    }
  });
});
