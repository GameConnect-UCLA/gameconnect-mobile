import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { SearchHitUser } from '../types/explore.types'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'
import { useNavigation } from '@/src/core/hooks/useNavigation'

interface Props {
  user: SearchHitUser
}

const DEFAULT_AVATAR = 'https://i.pravatar.cc/300'

/**
 * Premium card component displaying search result user profile
 * @param user SearchHitUser data
 * @returns UserCard component
 */
export default function UserCard({ user }: Props) {
  const { push } = useNavigation()

  const handlePress = () => {
    push(`/user/${user.id}` as any)
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.cardContainer}
    >
      <View style={styles.headerRow}>
        <Image
          source={{ uri: user.profilePic || DEFAULT_AVATAR }}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName} numberOfLines={1}>
              {user.displayName}
            </Text>
            {user.verified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={Colors.text.accent}
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <Text style={styles.username} numberOfLines={1}>
            @{user.username}
          </Text>
        </View>
        <View style={styles.actionBtn}>
          <Text style={styles.actionText}>VER PERFIL</Text>
        </View>
      </View>

      {user.bio ? (
        <Text style={styles.bioText} numberOfLines={2}>
          {user.bio}
        </Text>
      ) : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text.primary,
    maxWidth: '90%',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  username: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  bioText: {
    fontSize: Typography.sizes.sm,
    color: '#2A2A2A',
    marginTop: Spacing.sm,
    lineHeight: 18,
    textAlign: 'justify',
  },
})
