import ProfileView from '@/src/features/profile/components/ProfileView'
import { mockUsersList } from '@/src/mocks/mock-users-list'
import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function UserProfileScreen() {
  const { push, back } = useNavigation()
  const { id } = useLocalSearchParams()

  const userFound = mockUsersList.find((u) => String(u.id) === String(id))

  if (!userFound) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuario no encontrado</Text>
      </View>
    )
  }

  return (
    <ProfileView
      user={userFound}
      isSelf={id === 'jorge-id'}
      onEditPress={() => push('/user/edit-profile')}
      onSettingsPress={() => push('/user/settings')}
      onAddGamePress={() => push('/user/favorite-games')}
      onBackPress={() => back()}
    />
  )
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  errorText: { fontSize: 18, color: '#666', fontWeight: 'bold' },
})
