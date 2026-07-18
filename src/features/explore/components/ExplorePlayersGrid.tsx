/** Explore players grid */
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { FeaturedPlayer } from '../utils/explore.utils'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'

type Props = {
  players: FeaturedPlayer[]
}

/** Player cards grid with avatar, name, level, follow button @param players FeaturedPlayer array @returns ExplorePlayersGrid component */
export default function ExplorePlayersGrid({ players }: Props) {
  return (
    <View style={styles.playersGrid}>
      {players.map((player) => (
        <View key={player.id} style={styles.playerCard}>
          <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
          <Text style={styles.playerName} numberOfLines={1}>
            {player.name}
          </Text>
          <Text style={styles.playerMeta}>{`Nivel ${player.level}`}</Text>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>SEGUIR</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  playersGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingBottom: 10,
  },
  playerCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 22,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: Radii.xl,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(11, 75, 130, 0.16)',
  },
  playerName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
    textAlign: 'center',
  },
  playerMeta: {
    fontSize: Typography.sizes.xs,
    color: '#2F2F2F',
    marginBottom: Spacing.sm,
  },
  followButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    minWidth: 78,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
})
