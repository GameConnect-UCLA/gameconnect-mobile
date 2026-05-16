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

export interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

export interface FeaturedPost {
  title: string;
  description: string;
  tag: string;
}

// 1. AGREGA ESTA NUEVA INTERFAZ AQUÍ
export interface FavoriteGame {
  id: string;
  name: string;
  image_url: string;
  description: string;
}

export interface User {
  id: string;
  display_name: string;
  username: string;
  role: UserRole;
  email: string;
  bio?: string;
  pronouns?: string;
  birth_date?: string;
  account_settings: Record<string, any>;
  profile_pic: string;
  cover_pic: string;          
  stats: UserStats;           
  favorite_games: FavoriteGame[];   
  featured_post: FeaturedPost;
  state: UserState;
  banned_at?: string | null;
  ban_reason?: string | null;
  created_at: string;
  deleted_at?: string | null;
  verified?: boolean;
}