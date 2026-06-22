/** Single notification row with avatar, content, and action buttons. */

import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import {
  NotificationType,
  type Notification,
  type FollowRequestNotification,
  type InvitationGameNotification,
  type InvitationTeamNotification,
  type LikeNotification,
  type CommentNotification,
  type MentionNotification,
  type SuggestionNotification,
} from '../types/notifications.types'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onAcceptFollowRequest?: (id: string) => void
  onRejectFollowRequest?: (id: string) => void
  onAcceptInvitation?: (id: string) => void
  onRejectInvitation?: (id: string) => void
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return `Hace ${Math.floor(interval)} años`
  interval = seconds / 2592000
  if (interval > 1) return `Hace ${Math.floor(interval)} meses`
  interval = seconds / 604800
  if (interval > 1) return `Hace ${Math.floor(interval)} semanas`
  interval = seconds / 86400
  if (interval > 1) return `Hace ${Math.floor(interval)} días`
  interval = seconds / 3600
  if (interval > 1) return `Hace ${Math.floor(interval)} horas`
  interval = seconds / 60
  if (interval > 1) return `Hace ${Math.floor(interval)} minutos`
  return 'Hace unos segundos'
}

/** Renders a single notification row with avatar, content, timestamp, and contextual action buttons. @param notification Notification data @param onMarkAsRead Marks notification read on tap @param onAcceptFollowRequest Accept follow request callback @param onRejectFollowRequest Reject follow request callback @param onAcceptInvitation Accept game/team invitation callback @param onRejectInvitation Reject game/team invitation callback */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onAcceptFollowRequest,
  onRejectFollowRequest,
  onAcceptInvitation,
  onRejectInvitation,
}) => {
  const isUnread = !notification.read

  const handlePress = () => {
    if (isUnread) {
      onMarkAsRead(notification.id)
    }
    console.log(`Notification pressed: ${notification.id}`)
  }

  const renderNotificationContent = () => {
    switch (notification.type) {
      case NotificationType.FOLLOW:
        const frn = notification as FollowRequestNotification
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{frn.sender.username}</Text>{' '}
            {frn.is_accepted ? 'ha comenzado a seguirte.' : 'quiere seguirte.'}
          </Text>
        )

      case NotificationType.LIKE_POST:
        const lkn = notification as LikeNotification
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{lkn.sender.username}</Text> Le dió me gusta a tu publicación
          </Text>
        )

      case NotificationType.COMMENTED_POST:
        const cmn = notification as CommentNotification
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{cmn.sender.username}</Text> {cmn.comment_preview}
          </Text>
        )

      case NotificationType.INVITATION_GAME:
        const ign = notification as InvitationGameNotification
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{ign.sender.username}</Text> te invitó a jugar{' '}
            <Text style={styles.highlightText}>{ign.game.name}</Text>
          </Text>
        )

      case NotificationType.INVITATION_TEAM:
        const itn = notification as InvitationTeamNotification
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{itn.sender.username}</Text> te invitó a unirte a su equipo{' '}
            <Text style={styles.highlightText}>{itn.team.name}</Text>
          </Text>
        )

      case NotificationType.MENTION:
        const mtn = notification as MentionNotification
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{mtn.sender.username}</Text> te mencionó en un comentario
          </Text>
        )

      case NotificationType.SUGGESTION:
        const sgn = notification as SuggestionNotification
        return (
          <Text style={styles.notificationText}>
            Nueva sugerencia de seguimiento:{' '}
            <Text style={styles.usernameText}>{sgn.target.name}</Text>
          </Text>
        )

      default:
        return <Text style={styles.notificationText}>Notificación.</Text>
    }
  }

  const renderRightElement = () => {
    switch (notification.type) {
      case NotificationType.SUGGESTION:
        return (
          <TouchableOpacity style={styles.followRightButton}>
            <Text style={styles.followRightButtonText}>Seguir</Text>
          </TouchableOpacity>
        )

      case NotificationType.LIKE_POST:
      case NotificationType.COMMENTED_POST:
      case NotificationType.MENTION:
        return (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150' }} 
            style={styles.postThumbnail} 
          />
        )
      default:
        return null
    }
  }

  const renderActionButtons = () => {
    switch (notification.type) {
      case NotificationType.INVITATION_GAME:
      case NotificationType.INVITATION_TEAM:
        const invStatus = (notification as InvitationGameNotification | InvitationTeamNotification).status
        if (invStatus === 'pending') {
          return (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onAcceptInvitation && onAcceptInvitation(notification.id)}
              >
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => onRejectInvitation && onRejectInvitation(notification.id)}
              >
                <Text style={styles.rejectButtonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          )
        }
        return <Text style={styles.statusText}>{invStatus === 'accepted' ? 'Aceptado' : 'Rechazado'}</Text>

      default:
        return null
    }
  }

  const getAvatarSource = () => {
    switch (notification.type) {
      case NotificationType.SUGGESTION:
        return { uri: (notification as SuggestionNotification).target.avatar }
      default:
        return { uri: (notification as any).sender.avatar }
    }
  }

  const renderAvatarOverlayIcon = () => {
    switch (notification.type) {
      case NotificationType.LIKE_POST:
        return <View style={[styles.overlayIconContainer, { backgroundColor: Colors.border }]}><Text style={styles.overlayIconText}>❤️</Text></View>
      case NotificationType.COMMENTED_POST:
      case NotificationType.MENTION:
        return <View style={[styles.overlayIconContainer, { backgroundColor: Colors.border }]}><Text style={styles.overlayIconText}>💬</Text></View>
      case NotificationType.INVITATION_GAME:
        return <View style={[styles.overlayIconContainer, { backgroundColor: Colors.border }]}><Text style={styles.overlayIconText}>🎮</Text></View>
      case NotificationType.INVITATION_TEAM:
        return <View style={[styles.overlayIconContainer, { backgroundColor: Colors.border }]}><Text style={styles.overlayIconText}>👥</Text></View>
      default:
        return null
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, isUnread && styles.unreadContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.avatarWrapper}>
        <Image source={getAvatarSource()} style={styles.avatar} />
        {renderAvatarOverlayIcon()}
      </View>

      <View style={styles.content}>
        {renderNotificationContent()}
        <Text style={styles.timeText}>{formatTimeAgo(notification.createdAt)}</Text>
        {renderActionButtons()}
      </View>

      {renderRightElement()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    backgroundColor: Colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  unreadContainer: {
    backgroundColor: Colors.border,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radii.xl,
    backgroundColor: '#FFFFFF',
  },
  overlayIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  overlayIconText: {
    fontSize: 9,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  notificationText: {
    color: '#000000',
    fontSize: Typography.sizes.md,
    lineHeight: 18,
  },
  usernameText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  highlightText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  timeText: {
    color: Colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  acceptButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: Radii.md,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#6c6a6c',
    opacity: 0.75,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: Radii.md,
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    color: '#000000',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  followRightButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
  },
  followRightButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
  },
  postThumbnail: {
    width: 52,
    height: 34,
    borderRadius: 4,
    backgroundColor: '#222',
  },
})
