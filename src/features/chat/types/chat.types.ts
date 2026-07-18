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
  groupPicture: string | null
  createdBy: string
  createdAt: string
  // UI-enhancement fields
  memberCount?: number
  isGroup?: boolean
  lastMessage?: string
  lastMessageTime?: string
  lastMessageSender?: string
  members?: GroupMember[]
  messages?: Message[]
}

export type GroupMember = {
  id: string
  userId: string
  conversation: string
  role: GroupRole
  joinedAt: string
  leftAt: string | null
  // UI-enhancement fields
  username?: string
  profilePic?: string | null
}

// Attachment type for media content
export type Attachment = {
  url: string
  type: AttachmentType
  thumbnailUrl?: string
  width?: number
  height?: number
}

export type GameInfoCard = {
  gameId: string
  title: string
  coverUrl: string
  developer: string
  ratingScore: string
  tags: string[]
}

export type Message = {
  id: string
  sentBy: string
  conversation: string | null
  replyTo: string | null
  type: MessageType
  messageText: string | null
  attachedMedia: Attachment[] | null
  sentAt: string
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  senderUsername?: string
  senderProfilePic?: string | null
  replyToMessage?: Message | null
  gameCard?: GameInfoCard | null
}

export type ActiveUser = {
  id: string
  username: string
  profilePic: string | null
  conversationId?: string
}

export type SharedMediaItem = {
  id: string
  url: string
  duration: string
  sentAt: string
  messageId: string
  width?: number
  height?: number
}

export type SharedLinkItem = {
  id: string
  url: string
  title: string
  sentAt: string
  messageId: string
}

export type ContactInfo = {
  bio: string
  username: string
  email: string
}
