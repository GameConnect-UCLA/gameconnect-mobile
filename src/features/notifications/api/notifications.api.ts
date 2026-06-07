/** API functions for fetching and responding to notifications. */

import { apiClient } from '@/src/core/api/client'
import type { Notification } from '../types/notifications.types'

/** GET /notifications — fetch all notifications. @returns Promise resolving to Notification array */
export const fetchNotificationsApi = async (): Promise<Notification[]> => {
  const { data } = await apiClient.get<Notification[]>('/notifications')
  return data
}

/** POST /notifications/follow-request/accept — accept a follow request. @param id Notification ID to accept */
export const acceptFollowRequestApi = async (id: string): Promise<void> => {
  await apiClient.post('/notifications/follow-request/accept', { id })
}

/** POST /notifications/follow-request/reject — reject a follow request. @param id Notification ID to reject */
export const rejectFollowRequestApi = async (id: string): Promise<void> => {
  await apiClient.post('/notifications/follow-request/reject', { id })
}
