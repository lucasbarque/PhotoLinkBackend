import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

import { CheckTokenUseCase } from './check-token';
import { GetResetPasswordTokenUseCase } from './get-reset-password-token';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { TokenExpiratedError } from '@/errors/token-expirated';
import PasswordHash from '@/infra/utils/PasswordHash';

let usersRepository: InMemoryUsersRepository;
let getResetPasswordUseCase: GetResetPasswordTokenUseCase;
let sut: CheckTokenUseCase;

describe('Check Token Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getResetPasswordUseCase = new GetResetPasswordTokenUseCase(usersRepository);
    sut = new CheckTokenUseCase(usersRepository);

    vi.useFakeTimers();
  });

  it('should be able to check is valid token', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: await PasswordHash.hash('123456'),
    });

    const { token } = await getResetPasswordUseCase.execute({
      email: createdUser.email,
    });

    if (token) {
      const response = await sut.execute({ token });

      expect(response).toBeTruthy();
    }
  });

  it('should not be able check a invalid token', async () => {
    await expect(() =>
      sut.execute({ token: 'invalid-token' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able check a expirated token', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: await PasswordHash.hash('123456'),
    });

    vi.setSystemTime(new Date(2023, 0, 1, 8, 0));

    const { token } = await getResetPasswordUseCase.execute({
      email: createdUser.email,
    });

    vi.setSystemTime(new Date(2023, 0, 3, 8, 0));

    if (token) {
      await expect(() => sut.execute({ token })).rejects.toBeInstanceOf(
        TokenExpiratedError
      );
    }
  });
});
