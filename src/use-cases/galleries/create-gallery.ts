import { GalleriesRepository } from '@/repositories/galleries-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { IGallery } from '@/interfaces/IGallery';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { ResourceAlreadyExistsError } from '@/errors/resource-already-exists-error';
import Slugify from '@/infra/utils/Slugify';

type CreateGalleryUseCaseRequest = Omit<IGallery.DTOs.Create, 'slug'>;

export class CreateGalleryUseCase {
  constructor(
    private galleriesRepository: GalleriesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({ title, user_id }: CreateGalleryUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const slug = `${Slugify.slug(user.name)}/${Slugify.slug(title)}`;

    const slugExists = await this.galleriesRepository.findBySlug(slug);

    if (slugExists) {
      throw new ResourceAlreadyExistsError();
    }

    const gallery = await this.galleriesRepository.create({
      title,
      user_id,
      slug,
    });

    return { gallery };
  }
}
