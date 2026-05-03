// types/user.types.ts

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export enum UserState {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  INACTIVE = 'INACTIVE'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email: string;
  bio?: string;
  birth_date?: string;
  account_settings: Record<string, any>;
  profile_pic: string;
  state: UserState;
  banned_at?: string | null;
  ban_reason?: string | null;
  created_at: string;
  deleted_at?: string | null;
}