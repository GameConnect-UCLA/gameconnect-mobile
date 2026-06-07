import ProfileView from '@/src/features/profile/components/ProfileView'
import { useMockUser } from '@/src/features/profile/hooks/useCurrentUser'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function ProfileScreen() {
  const { push, back } = useNavigation()
  const user = useMockUser()

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
