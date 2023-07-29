export namespace IGallery {
  export enum GalleryStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
  }

  export interface PhotosData {
    cover?: {
      id: string;
      filename: string;
    };
    folderId: string;
  }

  export interface Entity {
    id: string;
    title: string;
    slug: string;
    photos_count?: number;
    user_id: string;
    photos_data?: PhotosData;
    created_at?: Date;
  }

  export namespace DTOs {
    export type List = {
      page: number;
      perPage: number;
      search: string;
    };

    export type Create = {
      title: string;
      user_id: string;
      slug: string;
    };

    export type Edit = {
      title?: string;
      slug?: string;
      photosCount?: string;
    };
  }
}
