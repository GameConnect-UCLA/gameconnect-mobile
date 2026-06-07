/** Scrollable post feed with animated header, pull-to-refresh, and reload hint. */

import PostCard from './PostCard'
import FeedHeader from './FeedHeader'
import { usePostStore } from '../store/post.store'
import type { Post } from '@/src/core/types/post.types'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Spacing, Typography } from '@/src/core/theme'
import { useNavigation } from '@/src/core/hooks/useNavigation'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as unknown as React.ComponentType<React.ComponentProps<typeof FlatList<Post>> & { ref?: React.Ref<FlatList<Post>> }>

/** Renders scrollable feed of posts with animated collapsible header. */
export default function Feed() {
  const posts = usePostStore((state) => state.posts)
  const lastAddedId = usePostStore((state) => state.lastAddedId)
  const reloadPosts = usePostStore((state) => state.reloadPosts)

  const flatListRef = useRef<FlatList<Post> | null>(null)
  const { push } = useNavigation()
  const [refreshing, setRefreshing] = useState(false)
  const [showReloadHint, setShowReloadHint] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(132)
  const scrollY = useRef(new Animated.Value(0)).current

  const clampedScrollY = Animated.diffClamp(
    scrollY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp',
    }),
    0,
    headerHeight,
  )

  const headerTranslateY = clampedScrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  })

  useEffect(() => {
    if (lastAddedId && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
      }, 80)
    }
  }, [lastAddedId])

  const handleRefresh = async () => {
    setRefreshing(true)
    setShowReloadHint(false)
    try {
      reloadPosts()
    } catch {
      // ignore for mock
    }
    setTimeout(() => setRefreshing(false), 600)
  }

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y ?? 0
    setShowReloadHint(y < -40)
  }

  return (
    <ImageBackground
      source={require('@/assets/images/bgbody.png')}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.screenContent}>
          <AnimatedFlatList
            ref={flatListRef}
            data={posts}
            keyExtractor={(item: Post) => item.id}
            renderItem={({ item }: { item: Post }) => (
              <PostCard post={item} separatorColor="rgba(97, 75, 47, 0.16)" />
            )}
            contentContainerStyle={[
              styles.listContent,
              { paddingTop: headerHeight },
            ]}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: true,
                listener: handleScroll,
              },
            )}
            scrollEventThrottle={16}
          />

          <Animated.View
            style={[
              styles.headerWrapper,
              { transform: [{ translateY: headerTranslateY }] },
            ]}
            onLayout={(event) =>
              setHeaderHeight(event.nativeEvent.layout.height)
            }
          >
            {showReloadHint || refreshing ? (
              <View style={styles.reloadOverlay}>
                <TouchableOpacity
                  onPress={handleRefresh}
                  style={styles.reloadButton}
                >
                  <Ionicons
                    name={refreshing ? 'refresh' : 'reload'}
                    size={18}
                    color={Colors.primaryDark}
                  />
                  <Text style={styles.reloadText}>
                    {refreshing ? 'Recargando...' : 'Recargar'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <FeedHeader
              onSearchPress={() => push('/explore')}
              onChatPress={() => push('/chat')}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContent: { flex: 1, overflow: 'hidden' },
  headerWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  listContent: { paddingBottom: Spacing.xl },
  reloadOverlay: {
    position: 'absolute', top: 6, left: 0, right: 0,
    alignItems: 'center', zIndex: 11,
  },
  reloadButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(11,75,130,0.06)',
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, alignSelf: 'center',
  },
  reloadText: { color: Colors.primaryDark, marginLeft: Spacing.sm, fontSize: Typography.sizes.sm },
})
