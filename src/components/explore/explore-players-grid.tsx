import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { FeaturedPlayer } from './explore.utils';

type Props = {
  players: FeaturedPlayer[];
};

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
  );
}

const styles = StyleSheet.create({
  playersGrid: {
    flexDirection: 'row',
    gap: 12,
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
    borderRadius: 24,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(11, 75, 130, 0.16)',
  },
  playerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
    textAlign: 'center',
  },
  playerMeta: {
    fontSize: 11,
    color: '#2F2F2F',
    marginBottom: 8,
  },
  followButton: {
    backgroundColor: '#0B4B82',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minWidth: 78,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
