import { UsersRepository } from '@/repositories/users-repository';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

import { randomUUID } from 'node:crypto';
import { env } from '@/env';
import { IUser } from '@/interfaces/IUser';
import sharp from 'sharp';
import GoogleDriveService from '@/infra/services/GoogleDrive';

interface ChangeAvatarUseCaseRequest {
  id: string;
  avatar: any;
}

export class ChangeAvatarUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id, avatar }: ChangeAvatarUseCaseRequest) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const avatarData = (user.avatar_data as IUser.AvatarData) ?? null;
    const file = await sharp(await avatar.toBuffer()).resize(80, 80);

    try {
      const googleDriveService = new GoogleDriveService();
      const googleDriveClient = await googleDriveService.getDriveClient();

      if (avatarData) {
        await googleDriveClient.files
          .get({
            fileId: avatarData.id,
          })
          .then(async ({ data }) => {
            await googleDriveClient.files.delete({
              fileId: data.id!,
            });
          });
      }

      const filename = randomUUID();

      const fileMetadata = {
        name: filename,
        parents: [env.GOOGLE_USERS_FOLDER],
      };

      const media = {
        mimeType: avatar.mimetype,
        body: file,
      };

      const response = await googleDriveClient.files.create({
        // @ts-ignore
        resource: fileMetadata,
        media,
        field: 'id',
      });

      await this.usersRepository.update(id, {
        // @ts-ignore
        avatar_data: { id: response.data.id, filename },
      });
    } catch (error) {
      console.log(error);
    }

    return {};
  }
}
