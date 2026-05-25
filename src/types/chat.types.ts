import { ImageSourcePropType } from "react-native";

// Enums matching DBML schema
export enum MessageType {
  GROUP_MESSAGE = 'GROUP_MESSAGE',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE'
}

// Attachment types for media content
export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  GIF = 'gif',
  DOCUMENT = 'document',
  AUDIO = 'audio',
}

export enum GroupRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

// User enums matching DBML schema
export enum UserRole {
  MODERATOR = 'MODERATOR',
  USER = 'USER'
}

export enum UserState {
  ACTIVE = 'ACTIVE',
  TO_DELETE = 'TO_DELETE'
}

// Types matching database tables
export type Conversation = {
  id: string;
  name: string | null;
  group_picture: string | null;
  created_by: string;
  created_at: string;
  // UI-enhancement fields
  member_count?: number;
  is_group?: boolean;
  last_message?: string;
  last_message_time?: string;
  last_message_sender?: string;
  members?: GroupMember[];
  messages?: Message[];
};

export type GroupMember = {
  id: string;
  user_id: string;
  conversation: string;
  role: GroupRole;
  joined_at: string;
  left_at: string | null;
  // UI-enhancement fields
  username?: string;
  profile_pic?: string | null;
};

// Attachment type for media content
export type Attachment = {
  url: string;
  type: AttachmentType;
  thumbnail_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  duration?: number;
  trim_start?: number;
  trim_end?: number;
  muted?: boolean;
};

export type GameInfoCard = {
  game_id: string;
  title: string;
  cover_url: string;
  developer: string;
  rating_score: string;
  tags: string[];
};

export type Message = {
  id: string;
  sent_by: string;
  conversation: string | null;
  reply_to: string | null;
  type: MessageType;
  message_text: string | null;
  attached_media: Attachment[] | null;
  sent_at: string;
  // UI-enhancement fields
  sender_username?: string;
  sender_profile_pic?: string | null;
  reply_to_message?: Message | null;
  game_card?: GameInfoCard | null;
};

// User type matching dbschema
export type User = {
  id: string;
  username: string | null;
  role: UserRole;
  email: string | null;
  bio: string | null;
  birth_date: string | null;
  account_settings: Record<string, any> | null;
  profile_pic: string | null;
  state: UserState;
  banned_at: string | null;
  ban_reason: string | null;
  created_at: string;
  deleted_at: string | null;
};

// Legacy UI-specific types (for compatibility with existing components)
export type ConversationUI = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  lastMessage: string;
  time: string;
  memberCount?: number;
  sender?: string;
  isGroup?: boolean;
  members: GroupMemberUI[];
};

export type GroupMemberUI = {
  id: string;
  userId: string;
  role?: string;
  joined_at?: string;
  left_at?: string;
  username: string;
  profilePic?: string;
};

export type ActiveUser = {
  id: string;
  username: string;
  profile_pic: string | null;
  conversationId?: string;
};

export type SharedMediaItem = {
  id: string;
  url: string;
  duration: string;
  sent_at: string;
  message_id: string;
  width?: number;
  height?: number;
};

export type SharedFileItem = {
  id: string;
  filename: string;
  file_size: string;
  file_type: string;
  sent_at: string;
  message_id: string;
};

export type SharedLinkItem = {
  id: string;
  url: string;
  title: string;
  sent_at: string;
  message_id: string;
};

export type ContactInfo = {
  bio: string;
  username: string;
  email: string;
};
