import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

import { GetResetPasswordTokenUseCase } from './get-reset-password-token';
import PasswordHash from '@/infra/utils/PasswordHash';

let usersRepository: InMemoryUsersRepository;
let sut: GetResetPasswordTokenUseCase;

describe('Get Reset Password Token Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetResetPasswordTokenUseCase(usersRepository);
  });

  it('should be able to get token', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: await PasswordHash.hash('123456'),
    });

    const response = await sut.execute({ email: createdUser.email });

    expect(response).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        expires_at: expect.any(Date),
      })
    );
  });

  it('should not be able to get token with an invalid e-mail', async () => {
    await expect(() =>
      sut.execute({ email: 'invalid-email@email.com' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
