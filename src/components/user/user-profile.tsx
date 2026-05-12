import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { mockUser } from '../../hooks/mock-data/mock-user';

export default function UserProfileScreen() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: mockUser.profile_pic }} style={styles.avatar} />
      <Text style={styles.displayName}>{mockUser.display_name}</Text>
      <Text style={styles.username}>{`@${mockUser.username}`}</Text>
      <Text style={styles.bio}>{mockUser.bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  displayName: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  username: { fontSize: 16, color: 'gray', marginTop: 4 },
  bio: { fontSize: 16, color: 'gray', marginTop: 5 },
});