/** Frontend ↔ Backend API contracts for Notifications module. */
/** Possible notification event types. */
export type NotificationEvent =
  | 'FOLLOW'
  | 'LIKE_POST'
  | 'COMMENTED_POST'
  | 'SUGGESTION'
  | 'INVITATION_GAME'
  | 'INVITATION_TEAM'
  | 'MENTION'

/** A single notification. */
export interface NotificationResponse {
  id: string
  user_id: string
  type: NotificationEvent
  payload: Record<string, unknown>
  read: boolean
  created_at: string
}

/** Paginated list of notifications with unread count. */
export interface NotificationListResponse {
  notifications: NotificationResponse[]
  unread_count: number
}

/** Payload to accept/reject a follow request. */
export interface FollowRequestActionRequest {
  id: string
}
