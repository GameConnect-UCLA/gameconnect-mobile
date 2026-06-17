import { ActivityIndicator, View } from 'react-native'
import ProfileView from '@/src/features/profile/components/ProfileView'
import { useCurrentUser } from '@/src/features/profile/hooks/useCurrentUser'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function ProfileScreen() {
  const { push, back } = useNavigation()
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ProfileView
      user={user}
      isSelf={true}
      onEditPress={() => push('/user/edit-profile')}
      onViewAllGamesPress={() => push('/user/favorite-games')}
      onAddPeoplePress={() => console.log('Navegar a búsqueda de personas')}
      onAddGamePress={() => push('/user/favorite-games')}
      onBackPress={() => back()}
      onSettingsPress={() => push('/user/settings')}
    />
  )
}
