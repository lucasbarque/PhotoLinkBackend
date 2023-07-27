import { UsersRepository } from '@/repositories/users-repository';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { googleDriveService } from '@/infra/services/GoogleDrive';
import { randomUUID } from 'node:crypto';
import { env } from '@/env';
import { IUser } from '@/interfaces/IUser';
import sharp from 'sharp';

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
      if (avatarData) {
        await googleDriveService.files
          .get({
            fileId: avatarData.id,
          })
          .then(async ({ data }) => {
            await googleDriveService.files.delete({
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

      const response = await googleDriveService.files.create({
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
