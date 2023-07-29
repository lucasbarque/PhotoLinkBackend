import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

import { CreateGalleryUseCase } from './create-gallery';
import { InMemoryGalleriesRepository } from '@/repositories/in-memory/in-memory-galleries-repository';
import PasswordHash from '@/infra/utils/PasswordHash';

let usersRepository: InMemoryUsersRepository;
let galleriesRepository: InMemoryGalleriesRepository;
let sut: CreateGalleryUseCase;

describe('Create Gallery Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    galleriesRepository = new InMemoryGalleriesRepository();
    sut = new CreateGalleryUseCase(galleriesRepository, usersRepository);
  });

  it('should be able to create a gallery', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(67) 9 9199-7210',
      password: await PasswordHash.hash('123456'),
    });

    const { gallery } = await sut.execute({
      title: 'My Gallery',
      user_id: createdUser.id,
    });

    expect(gallery).toEqual(
      expect.objectContaining({
        title: 'My Gallery',
      })
    );
  });
});
