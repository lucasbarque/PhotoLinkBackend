export namespace IUser {
  export enum UserRoles {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
  }

  export interface Entity {
    id: string;
    name: string;
    email: string;
    phone: string;
    password_hash: string;
    reset_password_token?: string;
    reset_password_expiration?: Date;
    role?: UserRoles;
    created_at?: Date;
  }

  export namespace DTOs {
    export type List = {
      page: number;
      perPage: number;
      search: string;
    };

    export type Create = {
      name: string;
      email: string;
      password: string;
      phone: string;
    };

    export type Edit = {
      name?: string;
      email?: string;
      phone?: string;
      password_hash?: string;
      reset_password_token?: string | null;
      reset_password_expiration?: Date | null;
    };
  }
}
