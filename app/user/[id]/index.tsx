import ProfileView from '@/src/features/profile/components/ProfileView'
import { useLocalSearchParams } from 'expo-router'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@/src/core/hooks/useNavigation'
import { useUserStore } from '@/src/core/store/user.store'

export default function UserProfileScreen() {
    const { push, back } = useNavigation()
    const { id } = useLocalSearchParams()
    const { user } = useUserStore()
    const isLoggedUser = id === user?.id

    return (
        <ProfileView
            userId={id as string}
            isSelf={isLoggedUser}
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

