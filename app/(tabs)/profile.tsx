import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import ProfileView from '@/src/features/profile/components/ProfileView'
import { useGetMe } from '@/src/features/profile/hooks/useGetMe'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function ProfileScreen() { 
  const { push, back } = useNavigation()
  const { data: user, isLoading, isError, refetch } = useGetMe()

  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isError || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 16, marginBottom: 12, textAlign: 'center' }}>
          Error al cargar el perfil.
        </Text>
        <TouchableOpacity onPress={() => refetch()} style={{ padding: 12, backgroundColor: '#9b1999', borderRadius: 8 }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Reintentar</Text>
        </TouchableOpacity>
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
