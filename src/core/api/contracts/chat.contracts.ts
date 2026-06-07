/** Frontend ↔ Backend API contracts for Chat module. */
/** Payload for sending a chat message. */
export interface SendMessageRequest {
  conversation_id: string
  message_text: string | null
  attachments?: AttachmentPayload[] | null
  sender_id?: string
  reply_to?: string | null
  game_card?: GameCardPayload | null
}

/** Attachment (image/gif) within a message. */
export interface AttachmentPayload {
  url: string
  type: 'image' | 'gif'
  thumbnail_url?: string
  width?: number
  height?: number
}

/** Game card shared in a message. */
export interface GameCardPayload {
  game_id: string
  title: string
  cover_url: string
  developer: string
  rating_score: string
  tags: string[]
}

/** Message response from server. */
export interface MessageResponse {
  id: string
  sent_by: string
  conversation: string
  reply_to: string | null
  type: 'GROUP_MESSAGE' | 'DIRECT_MESSAGE'
  message_text: string | null
  attached_media: AttachmentPayload[] | null
  sent_at: string
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

/** Chat conversation (direct or group) response. */
export interface ConversationResponse {
  id: string
  name: string | null
  group_picture: string | null
  created_by: string
  created_at: string
  member_count: number
  is_group: boolean
  last_message?: string
  last_message_time?: string
  last_message_sender?: string
  members: GroupMemberResponse[]
  messages?: MessageResponse[]
}

/** Member within a conversation. */
export interface GroupMemberResponse {
  id: string
  user_id: string
  conversation: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joined_at: string
  left_at: string | null
  username?: string
  profile_pic?: string | null
}

/** Payload to create a group conversation. */
export interface CreateGroupRequest {
  name: string
  group_pic: string | null
  member_ids: string[]
}

/** Payload to start a direct conversation with a user. */
export interface StartConversationRequest {
  user_id: string
}

/** Payload to block a user. */
export interface BlockUserRequest {
  user_id: string
}

/** Payload targeting a specific member in a conversation. */
export interface MemberActionRequest {
  conversation_id: string
  member_id: string
}

/** Payload to add a user to a group conversation. */
export interface AddMemberRequest {
  conversation_id: string
  user_id: string
}
