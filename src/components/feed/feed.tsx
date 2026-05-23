import PostCard from '@/src/components/posts/post-card';
import Header from '@/src/components/ui/feed-header';
import { usePostStore } from '@/src/store/post.store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function Feed() {
  const router = useRouter();
  const posts = usePostStore((state) => state.posts);
  const lastAddedId = usePostStore((state) => state.lastAddedId);
  const reloadPosts = usePostStore((state) => state.reloadPosts);

  const flatListRef = useRef<FlatList<any> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showReloadHint, setShowReloadHint] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(132);
  const scrollY = useRef(new Animated.Value(0)).current;

  const clampedScrollY = Animated.diffClamp(
    scrollY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp',
    }),
    0,
    headerHeight,
  );

  const headerTranslateY = clampedScrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

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

  return (
    <ImageBackground source={require('../../../assets/images/bgbody.png')} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.screenContent}>
          <AnimatedFlatList
            ref={flatListRef}
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} separatorColor="rgba(97, 75, 47, 0.16)" />}
            contentContainerStyle={[styles.listContent, { paddingTop: headerHeight }]}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: true,
                listener: handleScroll,
              }
            )}
            scrollEventThrottle={16}
          />

          <Animated.View
            style={[
              styles.headerWrapper,
              { transform: [{ translateY: headerTranslateY }] },
            ]}
            onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
          >
            {showReloadHint || refreshing ? (
              <View style={styles.reloadOverlay}>
                <TouchableOpacity onPress={handleRefresh} style={styles.reloadButton}>
                  <Ionicons name={refreshing ? 'refresh' : 'reload'} size={18} color="#0B4B82" />
                  <Text style={styles.reloadText}>{refreshing ? 'Recargando...' : 'Recargar'}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <Header onSearchPress={() => router.push('/explore')} onChatPress={() => {}} />
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    overflow: 'hidden',
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
  reloadOverlay: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 11,
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
