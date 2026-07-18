import GameEditProfileView from '@/src/features/game/components/GameEditProfileView'
import { useGameProfile } from '@/src/features/game/hooks/useGameProfiles'
import { useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export default function GameSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: game, isLoading } = useGameProfile(id ?? '')

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8A38F5" />
      </View>
    )
  }

  if (!game) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Juego no encontrado</Text>
      </View>
    )
  }

  return <GameEditProfileView game={game} />
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 18, color: '#111111', fontWeight: '600' },
})
