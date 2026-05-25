import ProfileView from '@/src/components/user/user-profile';
import { useMockUser } from '@/src/hooks/mock-data/useMockUser';
import { useRouter } from 'expo-router';
import React from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useMockUser(); 

  const handleEditPress = () => {
    router.push('/user/edit-profile');
  };

  const handleViewAllGamesPress = () => {
    router.push('/user/favorite-games');
  };

  const handleAddPeoplePress = () => {
    console.log("Navegar a búsqueda de personas");
  };

  const handleAddGamePress = () => {
    router.push('/user/favorite-games');
  };

  return (
    <ProfileView
      user={user}         
      isSelf={true}       
      onEditPress={handleEditPress}
      onViewAllGamesPress={handleViewAllGamesPress}
      onAddPeoplePress={handleAddPeoplePress}
      onAddGamePress={handleAddGamePress}
      onBackPress={() => router.back()}
      onSettingsPress={() => router.push('/user/settings')}
    />
  );
}