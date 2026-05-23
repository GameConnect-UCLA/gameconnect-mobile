import GameProfileView from '@/src/components/games/game-profile';
import { mockGameProfiles } from '@/src/hooks/mock-data/mock-game';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function GamePage() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const gameId = Array.isArray(id) ? id[0] : id;

  const game = mockGameProfiles.find((g) => String(g.id) === String(gameId));

  if (!game) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Juego no encontrado</Text>
      </View>
    );
  }

  return <GameProfileView game={game} />;
}