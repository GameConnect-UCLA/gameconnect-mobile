/** User-related types */
import type { Post } from '@/src/features/post/types/post.types'

/** User role enum */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

/** User state enum */
export enum UserState {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  INACTIVE = 'INACTIVE',
  TO_DELETE = 'TO_DELETE'
}

/** User statistics */
export interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

/** Featured post metadata */
export interface FeaturedPost {
  title: string;
  description: string;
  tag: string;
}

/** Favorite game entry */
export interface FavoriteGame {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

/** Full user entity */
export interface User {
  id: string;
  displayName: string;
  username: string;
  role: UserRole;
  email: string;
  bio?: string;
  pronouns?: string;
  birthDate?: string;
  accountSettings: Record<string, any>;
  profilePic: string;
  coverPic: string;
  stats: UserStats;
  favoriteGames: FavoriteGame[];
  featuredPost: FeaturedPost;
  state: UserState;
  bannedAt?: string | null;
  banReason?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  verified?: boolean;
  posts: Post[];
}
