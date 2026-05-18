import PostCard from '@/src/components/posts/post-card';
import Header from '@/src/components/ui/feed-header';
import { usePostStore } from '@/src/store/post.store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Feed() {
  const router = useRouter();
  const posts = usePostStore((state) => state.posts);
  const lastAddedId = usePostStore((state) => state.lastAddedId);
  const reloadPosts = usePostStore((state) => state.reloadPosts);

  const flatListRef = useRef<FlatList<any> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showReloadHint, setShowReloadHint] = useState(false);

  useEffect(() => {
    if (lastAddedId && flatListRef.current) {
      // small delay to ensure list has mounted/updated
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 80);
    }
  }, [lastAddedId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setShowReloadHint(false);
    try {
      reloadPosts();
    } catch (e) {
      // ignore for mock; could show toast
    }
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y ?? 0;
    // show reload hint when overscrolling at top
    setShowReloadHint(y < -40);
  };

  const HeaderWithReload = (
    <View>
      {(showReloadHint || refreshing) && (
        <View style={styles.reloadRow}>
          <TouchableOpacity onPress={handleRefresh} style={styles.reloadButton}>
            <Ionicons name={refreshing ? 'refresh' : 'reload'} size={18} color="#0B4B82" />
            <Text style={styles.reloadText}>{refreshing ? 'Recargando...' : 'Recargar'}</Text>
          </TouchableOpacity>
        </View>
      )}
      <Header onSearchPress={() => router.push('/explore')} />
    </View>
  );

  return (
    <ImageBackground source={require('../../../assets/images/bgbody.png')} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <FlatList
          ref={flatListRef}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} separatorColor="rgba(97, 75, 47, 0.16)" />}
          ListHeaderComponent={HeaderWithReload}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
  reloadRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11,75,130,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
  },
  reloadText: {
    color: '#0B4B82',
    marginLeft: 8,
    fontSize: 13,
  },
});
