import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

import PasswordHash from '@/infra/utils/PasswordHash';
import { ChangeAvatarUseCase } from './change-avatar';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeAvatarUseCase;

describe('Change Avatar Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeAvatarUseCase(usersRepository);
  });

  it('should be able to change a user avatar', async () => {
    // const createdUser = await usersRepository.create({
    //   name: 'John Doe',
    //   email: 'johndoe@example.com',
    //   phone: '(67) 9 9199-7210',
    //   password: await PasswordHash.hash('123456'),
    // });
    // const avatar = new File([''], 'avatar.jpg', { type: 'image/jpg' });
    // const response = await sut.execute({
    //   id: createdUser.id,
    //   avatar,
    // });
    // expect(response).toBeTruthy();
  });
});
