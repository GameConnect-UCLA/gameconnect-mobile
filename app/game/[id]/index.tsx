import GameProfileView from '@/src/features/game/components/GameProfileView'
import { useGameProfile } from '@/src/features/game/hooks/useGameProfiles'
import { useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Text, View } from 'react-native'

export default function GamePage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: game, isLoading } = useGameProfile(id ?? '')

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8A38F5" />
      </View>
    )
  }

  if (!game) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Juego no encontrado</Text>
      </View>
    )
  }

  return <GameProfileView game={game} />
}
