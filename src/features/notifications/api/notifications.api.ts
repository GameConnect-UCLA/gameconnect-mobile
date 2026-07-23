/** Notification API functions */
import { apiClient } from '@/src/core/api/client'
import { NotificationType } from '../types/notifications.types'
import type {
  Notification,
  LikeNotification,
  CommentNotification,
  FollowRequestNotification,
} from '../types/notifications.types'

const mapBackendNotification = (item: any): Notification => {
  const typeMap: Record<string, NotificationType> = {
    LIKE: NotificationType.LIKE_POST,
    COMMENT: NotificationType.COMMENTED_POST,
    FOLLOW: NotificationType.FOLLOW,
    MENTION: NotificationType.MENTION,
  }

  const type = typeMap[item.type] || (item.type as NotificationType)
  const payload = item.payload || {}
  const username =
    payload.likedBy ||
    payload.commentedBy ||
    payload.followedBy ||
    payload.username ||
    'Usuario'
  const avatar = payload.avatar || 'https://i.pravatar.cc/150?img=1'

  const base = {
    id: item.id,
    type,
    createdAt: item.createdAt || new Date().toISOString(),
    read: Boolean(item.read),
    sender: {
      id: payload.userId || item.userId || 'unknown',
      username,
      avatar,
    },
  }

  if (type === NotificationType.LIKE_POST) {
    return {
      ...base,
      type: NotificationType.LIKE_POST,
      post_id: payload.postId || '',
      preview: 'le dio me gusta a tu publicación',
    } as LikeNotification
  }

  if (type === NotificationType.COMMENTED_POST) {
    return {
      ...base,
      type: NotificationType.COMMENTED_POST,
      post_id: payload.postId || '',
      comment_preview: 'comentó tu publicación',
    } as CommentNotification
  }

  if (type === NotificationType.FOLLOW) {
    return {
      ...base,
      type: NotificationType.FOLLOW,
      is_accepted: payload.is_accepted ?? true,
    } as FollowRequestNotification
  }

  return {
    ...base,
    type: type as NotificationType,
  } as Notification
}

/** Fetch all notifications for current user @returns Notification list */
export const fetchNotificationsApi = async (): Promise<Notification[]> => {
  try {
    const { data } = await apiClient.get<any[]>('/notifications')
    if (!Array.isArray(data)) return []
    return data.map(mapBackendNotification)
  } catch {
    return []
  }
}

/** Mark a notification as read @param id Notification ID */
export const markNotificationAsReadApi = async (id: string): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`)
}

/** Accept a follow request @param id Notification ID */
export const acceptFollowRequestApi = async (id: string): Promise<void> => {
  await apiClient.post(`/notifications/${id}/accept`)
}

/** Reject a follow request @param id Notification ID */
export const rejectFollowRequestApi = async (id: string): Promise<void> => {
  await apiClient.post(`/notifications/${id}/reject`)
}
