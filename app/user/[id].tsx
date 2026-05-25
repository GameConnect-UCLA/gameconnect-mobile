import ProfileView from '@/src/components/user/user-profile';
import { mockUsersList } from '@/src/hooks/mock-data/mock-users-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter(); 

  const userFound = mockUsersList.find(u => String(u.id) === String(id));

  if (!userFound) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuario no encontrado</Text>
      </View>
    );
  }

  return (
    <ProfileView 
      user={userFound} 
      isSelf={id === 'jorge-id'} 
      
      onEditPress={() => router.push('/user/edit-profile')}
      onSettingsPress={() => router.push('/user/settings')}
      onAddGamePress={() => router.push('/user/favorite-games')}
      onBackPress={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold'
  },
});