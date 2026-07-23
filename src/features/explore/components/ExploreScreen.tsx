/** Explore screen */
import { Ionicons } from '@expo/vector-icons'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ExploreStickyHeader from './ExploreStickyHeader'
import UserCard from './UserCard'
import GameCard from './GameCard'
import PostCard from '@/src/features/feed/components/PostCard'
import { useNavigation } from '@/src/core/hooks/useNavigation'
import { useDebounce } from '@/src/core/hooks/useDebounce'
import { useTrendingFeed } from '../hooks/useTrendingFeed'
import { useSearch } from '../hooks/useSearch'
import { EmptyState } from '@/src/core/components/EmptyState'
import { Colors, Spacing, Typography } from '@/src/core/theme'
import type { FilterKey } from '../utils/explore.utils'

/** Explore screen with live search, trending feed, and filter tabs */
export default function ExploreScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>()
  const { back } = useNavigation()

  const [searchQuery, setSearchQuery] = useState(q?.replace('%23', '#') ?? '')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todo')

  const insets = useSafeAreaInsets()
  const [headerHeight, setHeaderHeight] = useState(160)
  const scrollY = useRef(new Animated.Value(0)).current

  const debouncedQuery = useDebounce(searchQuery, 400)
  const isSearchEmpty = searchQuery.trim() === ''

  // Set active filter to 'tags' if redirected with a hashtag query
  useEffect(() => {
    if (q?.startsWith('%23') || q?.startsWith('#')) {
      setActiveFilter('tags')
    }
  }, [q])

  // Build search options for useSearch hook
  const isTagFilter = activeFilter === 'tags'
  const searchOptions = {
    q: isTagFilter ? undefined : debouncedQuery,
    hashtag: isTagFilter ? debouncedQuery.replace('#', '') : undefined,
    type:
      activeFilter === 'gamers'
        ? ('user' as const)
        : activeFilter === 'posts'
        ? ('post' as const)
        : activeFilter === 'juegos'
        ? ('game' as const)
        : undefined,
    enabled: debouncedQuery.trim().length > 0 && !isSearchEmpty,
  }

  // Fetch trending feed if search bar is empty
  const {
    data: trendingData,
    fetchNextPage: fetchNextTrendingPage,
    hasNextPage: hasNextTrendingPage,
    isFetchingNextPage: isFetchingNextTrendingPage,
    isLoading: isLoadingTrending,
  } = useTrendingFeed(10)

  // Fetch search results if search bar is not empty
  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isLoading: isLoadingSearch,
  } = useSearch(searchOptions)

  // Combine query heights/offsets for sticky header translation
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

  // List data mapped reactive to empty/full search
  const listData = useMemo(() => {
    if (isSearchEmpty) {
      return trendingData ? trendingData.pages.flat() : []
    }
    return searchData ? searchData.pages.flatMap((page) => page.hits) : []
  }, [isSearchEmpty, trendingData, searchData])

  const handleHashtagPress = (tag: string) => {
    setActiveFilter('tags')
    setSearchQuery(tag)
  }

  const loadMore = () => {
    if (isSearchEmpty) {
      if (hasNextTrendingPage && !isFetchingNextTrendingPage) {
        fetchNextTrendingPage()
      }
    } else {
      if (hasNextSearchPage && !isFetchingNextSearchPage) {
        fetchNextSearchPage()
      }
    }
  }

  const renderItem = ({ item }: { item: any }) => {
    if (!isSearchEmpty) {
      if (item.type === 'post') {
        const mappedPost = {
          ...item,
          authorUser: item.authorUser || {
            displayName: item.displayName || 'Comunidad',
            username: item.username || 'gameconnect',
            profilePic: item.profilePic || 'https://i.pravatar.cc/300?img=12',
          },
          likesCounter: item.likesCounter ?? 0,
          commentsCounter: item.commentsCounter ?? 0,
          createdAt: item.createdAt || new Date().toISOString(),
          lastModifiedAt: item.lastModifiedAt || new Date().toISOString(),
          deletedAt: null,
        }
        return (
          <PostCard
            post={mappedPost}
            separatorColor="rgba(24, 18, 10, 0.12)"
            onHashtagPress={handleHashtagPress}
          />
        )
      } else if (item.type === 'user') {
        return <UserCard user={item} />
      } else if (item.type === 'game') {
        return <GameCard game={item} />
      }
      return null
    }

    // Trending mode: items are pure Post objects
    return (
      <PostCard
        post={item}
        separatorColor="rgba(24, 18, 10, 0.12)"
        onHashtagPress={handleHashtagPress}
      />
    )
  }

  const renderHeader = () => {
    if (isSearchEmpty) {
      return (
        <View style={styles.listHeader}>
          <Ionicons name="flame" size={18} color="#F45A49" />
          <Text style={styles.listHeaderTitle}>TENDENCIAS AHORA</Text>
        </View>
      )
    }
    return (
      <View style={styles.listHeader}>
        <Ionicons name="search" size={18} color={Colors.primaryDark} />
        <Text style={styles.listHeaderTitle}>RESULTADOS DE BÚSQUEDA</Text>
      </View>
    )
  }

  const renderEmptyState = () => {
    if (isSearchEmpty) {
      if (isLoadingTrending) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primaryDark} />
          </View>
        )
      }
      return (
        <EmptyState
          icon="newspaper-outline"
          title="No hay publicaciones en tendencia"
          description="Vuelve a intentarlo más tarde."
        />
      )
    }

    if (isLoadingSearch || searchQuery !== debouncedQuery) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primaryDark} />
        </View>
      )
    }

    return (
      <EmptyState
        icon="search-outline"
        title="Sin resultados"
        description={`No encontramos coincidencias para "${searchQuery}"`}
      />
    )
  }

  const renderFooter = () => {
    const isFetchingNext = isSearchEmpty ? isFetchingNextTrendingPage : isFetchingNextSearchPage
    if (isFetchingNext) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.primaryDark} />
        </View>
      )
    }
    return <View style={styles.footerSpacer} />
  }

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
        <Animated.FlatList
          data={listData}
          keyExtractor={(item: any, index: number) => item.id || `${index}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight }]}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
        />

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
  centerContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  listHeaderTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: 18,
    fontWeight: '800',
    color: '#141414',
    letterSpacing: 0.2,
  },
  footerLoader: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  footerSpacer: {
    height: 16,
  },
})
