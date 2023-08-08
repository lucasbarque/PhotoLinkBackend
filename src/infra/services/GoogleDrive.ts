import { env } from '@/env';
import { Auth, drive_v3, google } from 'googleapis';
import path from 'node:path';

import { IGoogleDriveService } from '@/interfaces/IGoogleDriveService';

export default class GoogleDriveService implements IGoogleDriveService {
  private authPromise: Promise<Auth.JWT> | null = null;

  private async createAuth(): Promise<Auth.JWT> {
    if (!this.authPromise) {
      this.authPromise = new Promise((resolve, reject) => {
        const auth = new google.auth.GoogleAuth({
          keyFile: path.resolve(__dirname, '../../../googlekeys.json'),
          scopes: ['https://www.googleapis.com/auth/drive'],
        });

        auth
          .getClient()
          .then((client) => resolve(client as Auth.JWT))
          .catch((error) => reject(error));
      });
    }

    return this.authPromise;
  }

  public async getDriveClient(): Promise<drive_v3.Drive> {
    const auth = await this.createAuth();
    return google.drive({
      version: 'v3',
      auth,
    });
  }

  public async createFolder(folderName: string, client: any): Promise<string> {
    const fileMetadata = {
      name: folderName,
      parents: [env.GOOGLE_GALLERIES_FOLDER],
      mimeType: 'application/vnd.google-apps.folder',
    };

    try {
      const file = await client.files.create({
        resource: fileMetadata,
        fields: 'id',
      });
      return file.data.id;
    } catch (err) {
      throw err;
    }
  }
}
