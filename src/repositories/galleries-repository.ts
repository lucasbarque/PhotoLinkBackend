import { Gallery, Prisma } from '@prisma/client';

import { IGallery } from '@/interfaces/IGallery';

export interface GalleriesRepository {
  findById(id: string): Promise<IGallery.Entity | Gallery | null>;
  findBySlug(slug: string): Promise<IGallery.Entity | Gallery | null>;
  create(data: IGallery.DTOs.Create): Promise<IGallery.Entity | Gallery>;
  update(
    id: string,
    data: IGallery.DTOs.Edit | Prisma.GalleryUpdateInput
  ): Promise<IGallery.Entity | Gallery | null>;
  findManyByUserId(
    userId: string,
    page: number
  ): Promise<IGallery.Entity[] | Gallery[] | null>;
  countByUserId(userId: string): Promise<any>;
}
