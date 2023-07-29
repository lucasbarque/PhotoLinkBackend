import { prisma } from '@/lib/prisma';

import { IGallery } from '@/interfaces/IGallery';
import { GalleriesRepository } from '../galleries-repository';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export class PrismaGalleriesRepository implements GalleriesRepository {
  async findById(id: string) {
    const gallery = await prisma.gallery.findUnique({
      where: {
        id,
      },
    });

    return gallery;
  }

  async findBySlug(slug: string) {
    const gallery = await prisma.gallery.findUnique({
      where: {
        slug: slug,
      },
    });

    return gallery;
  }

  async findManyByUserId(userId: string, page: number) {
    const galleries = await prisma.gallery.findMany({
      where: {
        user_id: userId,
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return galleries;
  }

  async countByUserId(userId: string) {
    return await prisma.gallery.count({
      where: {
        user_id: userId,
      },
    });
  }

  async create(data: IGallery.DTOs.Create) {
    const user = await prisma.gallery.create({
      data: {
        title: data.title,
        user_id: data.user_id,
        slug: data.slug,
      },
    });

    return user;
  }

  async update(id: string, data: Prisma.GalleryUpdateInput) {
    return await prisma.gallery.update({ data, where: { id } });
  }
}
