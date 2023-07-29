import { GalleriesRepository } from '@/repositories/galleries-repository';

interface FetchGaleriesUseCaseUseCaseRequest {
  perPage: number;
  page: number;
  userId: string;
}

export class FetchGalleriesUseCase {
  constructor(private galleriesRepository: GalleriesRepository) {}

  async execute({ userId, page, perPage }: FetchGaleriesUseCaseUseCaseRequest) {
    const galleries = await this.galleriesRepository.findManyByUserId(
      userId,
      page
    );

    const total = await this.galleriesRepository.countByUserId(userId);
    const nextPage = page * perPage < total ? page + 1 : null;

    return {
      meta: {
        page,
        perPage,
        nextPage,
        total,
      },
      galleries,
    };
  }
}
