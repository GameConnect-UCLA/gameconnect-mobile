// app/(tabs)/profile.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { mockUser } from '../../hooks/mock-data/mock-user'; // Ruta a tu archivo

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: mockUser.profile_pic }} 
        style={styles.avatar} 
      />
      <Text style={styles.username}>{mockUser.username}</Text>
      <Text style={styles.bio}>{mockUser.bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  username: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  bio: { fontSize: 16, color: 'gray', marginTop: 5 }
});