import { hash } from 'bcryptjs';

export default class PasswordHash {
  static async hash(password: string) {
    return await hash(password, 6);
  }
}
