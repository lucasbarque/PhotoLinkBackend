import { google } from 'googleapis';
import path from 'node:path';

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(__dirname, '../../../googlekeys.json'),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const googleDriveService = google.drive({
  version: 'v3',
  auth,
});
