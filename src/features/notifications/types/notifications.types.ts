/** Type definitions for all notification variants (follow, like, comment, invitation, mention, suggestion). */

export enum NotificationType {
  FOLLOW = 'FOLLOW',
  SUGGESTION = 'SUGGESTION',
  LIKE_POST = 'LIKE_POST',
  COMMENTED_POST = 'COMMENTED_POST',
  INVITATION_GAME = 'INVITATION_GAME',
  INVITATION_TEAM = 'INVITATION_TEAM',
  MENTION = 'MENTION',
}

interface BaseNotification {
  id: string
  type: NotificationType
  created_at: string
  read: boolean
}

export interface FollowRequestNotification extends BaseNotification {
  type: NotificationType.FOLLOW
  sender: { id: string; username: string; avatar: string }
  is_accepted: boolean
}

export interface SuggestionNotification extends BaseNotification {
  type: NotificationType.SUGGESTION
  text: string
  suggestion_type: 'user' | 'game' | 'team'
  target: { id: string; name: string; avatar?: string }
}

export interface LikeNotification extends BaseNotification {
  type: NotificationType.LIKE_POST
  sender: { id: string; username: string; avatar: string }
  post_id: string
  preview: string
  thumbnail?: string
}

export interface CommentNotification extends BaseNotification {
  type: NotificationType.COMMENTED_POST
  sender: { id: string; username: string; avatar: string }
  post_id: string
  comment_preview: string
  thumbnail?: string
}

export interface InvitationGameNotification extends BaseNotification {
  type: NotificationType.INVITATION_GAME
  sender: { id: string; username: string; avatar: string }
  game: { id: string; name: string; cover: string }
  status: 'pending' | 'accepted' | 'rejected'
}

export interface InvitationTeamNotification extends BaseNotification {
  type: NotificationType.INVITATION_TEAM
  sender: { id: string; username: string; avatar: string }
  team: { id: string; name: string; logo: string }
  status: 'pending' | 'accepted' | 'rejected'
}

export interface MentionNotification extends BaseNotification {
  type: NotificationType.MENTION
  sender: { id: string; username: string; avatar: string }
  post_id?: string
  comment_id?: string
  text: string
  thumbnail?: string
}

export type Notification =
  | FollowRequestNotification
  | SuggestionNotification
  | LikeNotification
  | CommentNotification
  | InvitationGameNotification
  | InvitationTeamNotification
  | MentionNotification
