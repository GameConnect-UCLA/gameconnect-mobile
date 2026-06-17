import { useState } from 'react'
import { Alert, View, ActivityIndicator, Text } from 'react-native'
import EditProfileView from '@/src/features/profile/components/EditProfileView'
import { useCurrentUser } from '@/src/features/profile/hooks/useCurrentUser'
import { profileApi } from '@/src/features/profile/api/profile.api'
import { mediaApi } from '@/src/core/api/media'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function EditProfileScreen() {
  const { back } = useNavigation()
  const { data: user, isLoading, isError } = useCurrentUser()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: {
    displayName: string
    username: string
    email: string
    pronouns: string
    bio: string
    newProfilePic?: string
    newCoverPic?: string
  }) => {
    setIsSaving(true)
    try {
      const payload: Record<string, string> = {
        displayName: data.displayName,
        username: data.username,
        bio: data.bio,
        pronouns: data.pronouns,
      }

      if (data.newProfilePic) {
        const profileExt = data.newProfilePic.split('.').pop() ?? 'jpg'
        const profileResult = await mediaApi.uploadFile(
          data.newProfilePic,
          `avatar.${profileExt}`,
          `image/${profileExt === 'png' ? 'png' : 'jpeg'}`,
        )
        payload.profilePic = profileResult.url
      }

      if (data.newCoverPic) {
        const coverExt = data.newCoverPic.split('.').pop() ?? 'jpg'
        const coverResult = await mediaApi.uploadFile(
          data.newCoverPic,
          `cover.${coverExt}`,
          `image/${coverExt === 'png' ? 'png' : 'jpeg'}`,
        )
        payload.coverPic = coverResult.url
      }

      await profileApi.updateProfile(payload)
      back()
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el perfil. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isError || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error al cargar el perfil</Text>
      </View>
    )
  }

  return (
    <EditProfileView
      user={user}
      onBack={() => back()}
      onSave={handleSave}
      isSaving={isSaving}
    />
  )
}
