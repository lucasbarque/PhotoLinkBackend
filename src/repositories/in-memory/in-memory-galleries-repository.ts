import { randomUUID } from 'node:crypto';

import { IGallery } from '@/interfaces/IGallery';
import { GalleriesRepository } from '../galleries-repository';

export class InMemoryGalleriesRepository implements GalleriesRepository {
  public items: IGallery.Entity[] = [];

  async findById(id: string) {
    const gallery = this.items.find((item) => item.id === id);
    if (!gallery) {
      return null;
    }
    return gallery;
  }

  async findBySlug(slug: string) {
    const gallery = this.items.find((item) => item.slug === slug);
    if (!gallery) {
      return null;
    }
    return gallery;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 10, page * 10);
  }

  async create(data: IGallery.DTOs.Create) {
    const gallery = {
      id: randomUUID(),
      title: data.title,
      slug: data.slug,
      user_id: data.user_id,
      created_at: new Date(),
    };
    this.items.push(gallery);
    return gallery;
  }

  async update(id: string, data: IGallery.DTOs.Edit) {
    const itemIndex = this.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return null;
    }

    const updatedItem = Object.assign({}, this.items[itemIndex], data);
    this.items[itemIndex] = updatedItem;

    return updatedItem;
  }
}
