/** Notification API functions */
import { apiClient } from '@/src/core/api/client'
import type { Notification } from '../types/notifications.types'

/** Fetch all notifications for current user @returns Notification list */
export const fetchNotificationsApi = async (): Promise<Notification[]> => {
  const { data } = await apiClient.get<Notification[]>('/notifications')
  return data
}

/** Accept a follow request @param id Notification ID */
export const acceptFollowRequestApi = async (id: string): Promise<void> => {
  await apiClient.post(`/notifications/${id}/accept`)
}

/** Reject a follow request @param id Notification ID */
export const rejectFollowRequestApi = async (id: string): Promise<void> => {
  await apiClient.post(`/notifications/${id}/reject`)
}
