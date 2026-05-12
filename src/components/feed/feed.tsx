import PostCard from '@/src/components/posts/post-card';
import Header from '@/src/components/ui/feed-header';
import { mockPosts } from '@/src/hooks/mock-data/mock-posts';
import React from 'react';
import { FlatList, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Feed() {
  return (
    <ImageBackground source={require('../../../assets/images/bgbody.png')} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <FlatList
          data={mockPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} separatorColor="rgba(97, 75, 47, 0.16)" />}
          ListHeaderComponent={<Header />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});
