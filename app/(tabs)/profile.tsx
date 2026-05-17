import ProfileView from '@/src/components/user/user-profile';
import { useRouter } from 'expo-router';
import React from 'react';

export default function ProfileScreen() {
  const router = useRouter();

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
    // Normalmente, el botón "+" también debería llevarte a la lista o a agregar
    router.push('/user/favorite-games');
  };

  return (
    <ProfileView
      onEditPress={handleEditPress}
      onViewAllGamesPress={handleViewAllGamesPress}
      onAddPeoplePress={handleAddPeoplePress}
      onAddGamePress={handleAddGamePress}
    />
  );
}