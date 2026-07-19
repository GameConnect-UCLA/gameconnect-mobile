import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { SearchHitGame } from '../types/explore.types'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'
import { useNavigation } from '@/src/core/hooks/useNavigation'

interface Props {
  game: SearchHitGame
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80'

/**
 * Premium card component displaying search result game profile
 * @param game SearchHitGame data
 * @returns GameCard component
 */
export default function GameCard({ game }: Props) {
  const { push } = useNavigation()

  const handlePress = () => {
    push(`/game/${game.id}` as any)
  }

  const scoreColor = (() => {
    const s = game.score ?? 0
    if (s >= 85) return Colors.status.success
    if (s >= 70) return Colors.status.warning
    return Colors.status.error
  })()

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        <Image
          source={{ uri: game.metadata.coverImage || DEFAULT_COVER }}
          style={styles.coverImage}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText} numberOfLines={2}>
              {game.name}
            </Text>
            {game.score !== undefined && (
              <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
                <Ionicons name="star" size={12} color="#FFFFFF" style={styles.starIcon} />
                <Text style={styles.scoreText}>{game.score}</Text>
              </View>
            )}
          </View>

          <Text style={styles.descriptionText} numberOfLines={3}>
            {game.metadata.description || 'Sin descripción disponible para este juego.'}
          </Text>

          <View style={styles.actionBtn}>
            <Text style={styles.actionText}>VER JUEGO</Text>
          </View>
        </View>
      </View>
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
  cardContent: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  coverImage: {
    width: 80,
    height: 110,
    borderRadius: Radii.md,
    backgroundColor: '#CCCCCC',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  titleText: {
    fontSize: Typography.sizes.lg,
    fontWeight: '800',
    color: Colors.text.primary,
    flex: 1,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  descriptionText: {
    fontSize: Typography.sizes.sm,
    color: '#3A3A3A',
    lineHeight: 18,
    marginVertical: Spacing.xs,
  },
  actionBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
})
