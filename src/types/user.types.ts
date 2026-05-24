export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
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

export interface FavoriteGame {
  id: string;
  name: string;
  image_url: string;
  description: string;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  likes: number;   
  comments: number;
  isLiked?: boolean; 
  isSaved?: boolean;
  commentsList?: Comment[];
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
  posts: Post[]; 
}