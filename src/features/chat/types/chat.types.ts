/** Chat type definitions: conversations, messages, attachments, members, and shared content */

// Enums matching DBML schema
export enum MessageType {
  GROUP_MESSAGE = 'GROUP_MESSAGE',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE'
}

// Attachment types for media content
export enum AttachmentType {
  IMAGE = 'image',
  GIF = 'gif',
}

export enum GroupRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

// Types matching database tables
export type Conversation = {
  id: string
  name: string | null
  group_picture: string | null
  created_by: string
  created_at: string
  // UI-enhancement fields
  member_count?: number
  is_group?: boolean
  last_message?: string
  last_message_time?: string
  last_message_sender?: string
  members?: GroupMember[]
  messages?: Message[]
}

export type GroupMember = {
  id: string
  user_id: string
  conversation: string
  role: GroupRole
  joined_at: string
  left_at: string | null
  // UI-enhancement fields
  username?: string
  profile_pic?: string | null
}

// Attachment type for media content
export type Attachment = {
  url: string
  type: AttachmentType
  thumbnail_url?: string
  width?: number
  height?: number
}

export type GameInfoCard = {
  game_id: string
  title: string
  cover_url: string
  developer: string
  rating_score: string
  tags: string[]
}

export type Message = {
  id: string
  sent_by: string
  conversation: string | null
  reply_to: string | null
  type: MessageType
  message_text: string | null
  attached_media: Attachment[] | null
  sent_at: string
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  sender_username?: string
  sender_profile_pic?: string | null
  reply_to_message?: Message | null
  game_card?: GameInfoCard | null
}

export type ActiveUser = {
  id: string
  username: string
  profile_pic: string | null
  conversationId?: string
}

export type SharedMediaItem = {
  id: string
  url: string
  duration: string
  sent_at: string
  message_id: string
  width?: number
  height?: number
}

export type SharedLinkItem = {
  id: string
  url: string
  title: string
  sent_at: string
  message_id: string
}

export type ContactInfo = {
  bio: string
  username: string
  email: string
}
