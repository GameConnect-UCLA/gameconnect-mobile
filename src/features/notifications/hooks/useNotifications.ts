/** Hook managing notifications state with TanStack Query (30s staleTime) and optimistic mutations. */

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotificationsApi,
  markNotificationAsReadApi,
  acceptFollowRequestApi,
  rejectFollowRequestApi,
} from '../api/notifications.api'
import {
  NotificationType,
  type Notification,
  type FollowRequestNotification,
  type InvitationGameNotification,
  type InvitationTeamNotification,
} from '../types/notifications.types'

/** Fetches notifications via TanStack Query (30s staleTime), exposes optimistic follow/invitation mutations. @returns Object with notifications array, loading/error state, refresh, markAsRead, accept/reject handlers */
export const useNotifications = () => {
  const queryClient = useQueryClient()

  const {
    data: notifications = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotificationsApi,
    staleTime: 30000,
  })

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsReadApi,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const prev = queryClient.getQueryData<Notification[]>(['notifications'])
      queryClient.setQueryData<Notification[]>(['notifications'], (old) =>
        old?.map((n) => (n.id === id ? { ...n, read: true } : n)) ?? old,
      )
      return { prev }
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['notifications'], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAsRead = useCallback(
    (id: string) => {
      markAsReadMutation.mutate(id)
    },
    [markAsReadMutation],
  )

  const acceptFollowRequest = useMutation({
    mutationFn: acceptFollowRequestApi,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const prev = queryClient.getQueryData<Notification[]>(['notifications'])
      queryClient.setQueryData<Notification[]>(['notifications'], (old) =>
        old?.map((n) =>
          n.id === id && n.type === NotificationType.FOLLOW
            ? { ...(n as FollowRequestNotification), is_accepted: true, read: true }
            : n,
        ) ?? old,
      )
      return { prev }
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['notifications'], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const rejectFollowRequest = useMutation({
    mutationFn: rejectFollowRequestApi,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const prev = queryClient.getQueryData<Notification[]>(['notifications'])
      queryClient.setQueryData<Notification[]>(['notifications'], (old) =>
        old?.filter((n) => n.id !== id) ?? old,
      )
      return { prev }
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['notifications'], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const handleAcceptInvitation = useCallback(
    (id: string) => {
      queryClient.setQueryData<Notification[]>(['notifications'], (prev) =>
        prev?.map((n) =>
          n.id === id && n.type === NotificationType.INVITATION_GAME
            ? { ...(n as InvitationGameNotification), status: 'accepted', read: true }
            : n.id === id && n.type === NotificationType.INVITATION_TEAM
              ? { ...(n as InvitationTeamNotification), status: 'accepted', read: true }
              : n,
        ) ?? prev,
      )
    },
    [queryClient],
  )

  const handleRejectInvitation = useCallback(
    (id: string) => {
      queryClient.setQueryData<Notification[]>(['notifications'], (prev) =>
        prev?.map((n) =>
          n.id === id && n.type === NotificationType.INVITATION_GAME
            ? { ...(n as InvitationGameNotification), status: 'rejected', read: true }
            : n.id === id && n.type === NotificationType.INVITATION_TEAM
              ? { ...(n as InvitationTeamNotification), status: 'rejected', read: true }
              : n,
        ) ?? prev,
      )
    },
    [queryClient],
  )

  return {
    notifications,
    isLoading,
    isFetching,
    error: null,
    refreshNotifications: () => refetch(),
    markAsRead,
    handleAcceptFollowRequest: (id: string) => acceptFollowRequest.mutate(id),
    handleRejectFollowRequest: (id: string) => rejectFollowRequest.mutate(id),
    handleAcceptInvitation,
    handleRejectInvitation,
  }
}
