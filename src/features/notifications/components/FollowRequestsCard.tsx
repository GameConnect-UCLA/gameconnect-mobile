/** Card summarizing pending follow requests with accept/reject all buttons. */

import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/src/core/theme'
import type { FollowRequestNotification } from '../types/notifications.types'

interface FollowRequestsCardProps {
  requests: FollowRequestNotification[]
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

/** Renders a card summarizing pending follow requests with accept/reject all actions. @param requests Pending follow request notifications @param onAccept Accept a follow request @param onReject Reject a follow request */
export const FollowRequestsCard: React.FC<FollowRequestsCardProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  if (requests.length === 0) {
    return null
  }

  const firstRequest = requests[0]
  const secondRequest = requests.length > 1 ? requests[1] : null
  const remainingCount = requests.length > 2 ? requests.length - 2 : 0

  const subtitleText = (
    secondRequest
      ? `${firstRequest.sender.username}, ${secondRequest.sender.username}`
      : `${firstRequest.sender.username}`
  ) + (remainingCount > 0 ? ` + ${remainingCount} mas` : '')

  const handleAcceptAll = () => {
    requests.forEach((req) => onAccept(req.id))
  }

  const handleRejectAll = () => {
    requests.forEach((req) => onReject(req.id))
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.contentWrapper} onPress={() => console.log('View all follow requests')}>
        <View style={styles.header}>
          <View style={styles.avatarStack}>
            <Image source={{ uri: firstRequest.sender.avatar }} style={styles.avatar} />
            {secondRequest && (
              <Image source={{ uri: secondRequest.sender.avatar }} style={[styles.avatar, styles.secondAvatar]} />
            )}
            {remainingCount > 0 && (
              <View style={[styles.badge, secondRequest ? styles.badgeOffset : {}]}>
                <Text style={styles.badgeText}>+{remainingCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Solicitudes de seguidores</Text>
            <Text style={styles.subtitle}>{subtitleText}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </View>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptAll}>
          <Text style={styles.acceptButtonText}>Aceptar todo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={handleRejectAll}>
          <Text style={styles.rejectButtonText}>Rechazar todo</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#d9d9d9',
    borderRadius: 30,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderColor: 'transparent',
    borderWidth: 1,
    overflow: 'hidden',
  },
  contentWrapper: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarStack: {
    flexDirection: 'row',
    position: 'relative',
    width: 60,
    height: 40,
    marginRight: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.text.primary,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  secondAvatar: {
    left: 20,
    top: 0,
    zIndex: 1,
  },
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FF00FF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.text.primary,
    zIndex: 2,
  },
  badgeOffset: {
    right: -5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#000000',
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#000000',
    opacity: 0.72,
    fontSize: Typography.sizes.md,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#3A3A3C',
    borderTopWidth: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.border,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Typography.sizes.md,
  },
  rejectButton: {
    backgroundColor: '#6c6a6c',
    opacity: 0.75,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Typography.sizes.md,
  },
})
