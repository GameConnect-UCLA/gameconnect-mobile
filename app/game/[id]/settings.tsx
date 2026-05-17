import GameEditProfileView from '@/src/components/games/game-edit-profile';
import { mockGameProfiles } from '@/src/hooks/mock-data/mock-game';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function GameSettingsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const gameId = Array.isArray(id) ? id[0] : id;
  const game = mockGameProfiles.find((item) => item.id === gameId);

  if (!game) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Juego no encontrado</Text>
      </View>
    );
  }

  return <GameEditProfileView game={game} />;
}

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: '#111111',
    fontWeight: '600',
  },
});
