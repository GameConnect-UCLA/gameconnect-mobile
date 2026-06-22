/** Explore screen */
import { Ionicons } from '@expo/vector-icons'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { normalizeText } from '@/src/core/utils/string'
import ExplorePlayersGrid from './ExplorePlayersGrid'
import ExploreSectionCard from './ExploreSectionCard'
import ExploreStickyHeader from './ExploreStickyHeader'
import {
  INITIAL_VISIBLE_POSTS,
  buildTrendLabel,
  getLevelFromPosts,
  matchesActiveFilter,
  type FeaturedPlayer,
  type FilterKey,
} from '../utils/explore.utils'
import PostCard from '@/src/features/feed/components/PostCard'
import { mockPosts } from '@/src/mocks/mock-posts'
import { useNavigation } from '@/src/core/hooks/useNavigation'
import { useRouter } from 'expo-router'

/** Explore screen with search, filters, trends, featured players, and posts @returns ExploreScreen component */
export default function ExploreScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>()
  const { back } = useNavigation()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(q?.replace('%23', '#') ?? '')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todo')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS)

  const insets = useSafeAreaInsets()
  const [headerHeight, setHeaderHeight] = useState(160)
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
    setVisibleCount(INITIAL_VISIBLE_POSTS)
  }, [searchQuery, activeFilter])

  const trendTags = useMemo(() => {
    const counts = new Map<string, number>()
    mockPosts.forEach((post) => {
      const sources = [post.reviewed_game, ...(post.media?.hashtags ?? [])].filter(Boolean)
      sources.forEach((source) => {
        const label = buildTrendLabel(source)
        counts.set(label, (counts.get(label) ?? 0) + 1)
      })
    })
    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([label]) => label)
  }, [])

  const featuredPlayers = useMemo<FeaturedPlayer[]>(() => {
    const authors = new Map<string, { name: string; handle: string; avatar: string; posts: number; likes: number }>()
    mockPosts.forEach((post) => {
      const current = authors.get(post.authorUsername)
      authors.set(post.authorUsername, {
        name: post.authorDisplayName,
        handle: post.authorUsername,
        avatar: post.author_profilePic,
        posts: (current?.posts ?? 0) + 1,
        likes: (current?.likes ?? 0) + post.likes_counter,
      })
    })
    return [...authors.values()]
      .sort((left, right) => right.posts - left.posts || right.likes - left.likes)
      .slice(0, 2)
      .map((author) => ({
        id: author.handle,
        name: author.name,
        handle: author.handle,
        avatar: author.avatar,
        level: getLevelFromPosts(author.posts, author.likes),
      }))
  }, [])

  const filteredPosts = useMemo(() => {
    const query = normalizeText(searchQuery.trim())
    return [...mockPosts]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .filter((post) => {
        const searchableText = normalizeText(
          [
            post.authorDisplayName,
            post.authorUsername,
            post.postTitle,
            post.reviewed_game,
            post.content,
            ...(post.media?.hashtags ?? []),
          ].join(' '),
        )
        return (query.length === 0 || searchableText.includes(query)) && matchesActiveFilter(post, activeFilter)
      })
  }, [activeFilter, searchQuery])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const featuredPosts = visiblePosts.slice(0, 2)
  const feedPosts = visiblePosts.slice(2)
  const hasMorePosts = visibleCount < filteredPosts.length

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require('@/assets/images/bgbody.png')}
        style={StyleSheet.absoluteFill}
        imageStyle={styles.backgroundImage}
      />
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <Stack.Screen options={{ presentation: 'modal', headerShown: false, title: 'Explorar' }} />

      <View style={[styles.safeArea, { marginTop: insets.top, overflow: 'hidden' }]}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight }]}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
        >
          <ExploreSectionCard icon={<Ionicons name="flame" size={18} color="#F45A49" />} title="Tendencias ahora">
            <View style={styles.trendWrap}>
              {trendTags.map((tag) => (
                <View key={tag} style={styles.trendChip}>
                  <Text style={styles.trendChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </ExploreSectionCard>

          <ExploreSectionCard
            icon={<Ionicons name="game-controller" size={18} color="#0B4B82" />}
            title="Juegos destacados"
          >
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} separatorColor="transparent" onHashtagPress={(tag) => router.replace(`/explore?q=%23${tag}`)} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No encontramos juegos con estos filtros.</Text>
              </View>
            )}
          </ExploreSectionCard>

          <ExploreSectionCard icon={<Ionicons name="people" size={18} color="#0B4B82" />} title="Jugadores destacados">
            <ExplorePlayersGrid players={featuredPlayers} />
          </ExploreSectionCard>

          <View style={styles.postsSection}>
            {feedPosts.map((post) => (
              <PostCard key={post.id} post={post} separatorColor="rgba(24, 18, 10, 0.12)" onHashtagPress={(tag) => router.replace(`/explore?q=%23${tag}`)} />
            ))}

            {hasMorePosts ? (
              <TouchableOpacity onPress={() => setVisibleCount(filteredPosts.length)} style={styles.loadMoreButton}>
                <Text style={styles.loadMoreText}>Cargar más</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.ScrollView>

        <Animated.View
          style={[
            styles.headerWrapper,
            { transform: [{ translateY: headerTranslateY }] },
          ]}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          <ExploreStickyHeader
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            onChangeSearch={setSearchQuery}
            onChangeFilter={setActiveFilter}
            onBackPress={() => back()}
          />
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  headerWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  contentContainer: { paddingBottom: 32 },
  backgroundImage: { resizeMode: 'cover' },
  trendWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 8 },
  trendChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.16)' },
  trendChipText: { color: '#1F1F1F', fontSize: 13, fontWeight: '600' },
  postsSection: { paddingTop: 6 },
  emptyState: { paddingVertical: 18, alignItems: 'center' },
  emptyStateText: { fontSize: 14, color: '#2D2D2D', textAlign: 'center' },
  loadMoreButton: {
    marginTop: 8, alignSelf: 'center', minWidth: 182, borderRadius: 22,
    backgroundColor: '#0B4B82', paddingVertical: 13, paddingHorizontal: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  loadMoreText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },
})
