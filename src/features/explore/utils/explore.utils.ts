/** Explore utilities and constants */
import type { Post } from '@/src/features/post/types/post.types'

/** Filter key for explore tabs */
export type FilterKey = 'todo' | 'gamers' | 'posts' | 'juegos' | 'tags'

/** Explore filter chip config */
export type ExploreChip = {
  key: FilterKey
  label: string
  icon:
    | 'grid-outline'
    | 'people-outline'
    | 'document-text-outline'
    | 'game-controller-outline'
    | 'pricetag-outline'
}

/** Featured player data */
export type FeaturedPlayer = {
  id: string
  name: string
  handle: string
  avatar: string
  level: number
}

/** Available explore filter chips */
export const FILTERS: ExploreChip[] = [
  { key: 'todo', label: 'TODO', icon: 'grid-outline' },
  { key: 'gamers', label: 'GAMERS', icon: 'people-outline' },
  { key: 'posts', label: 'POSTS', icon: 'document-text-outline' },
  { key: 'juegos', label: 'JUEGOS', icon: 'game-controller-outline' },
  { key: 'tags', label: '# TAGS', icon: 'pricetag-outline' },
]

/** Initial visible post count */
export const INITIAL_VISIBLE_POSTS = 3

/** Build trend hashtag label from source string @param source Source string @returns Hashtag label */
export function buildTrendLabel(source: string) {
  return `#${source.replace(/\s+/g, '')}`
}

/** Calculate player level from post and like counts @param authorPosts Post count @param totalLikes Like count @returns Level (1-99) */
export function getLevelFromPosts(authorPosts: number, totalLikes: number) {
  return Math.min(99, 25 + authorPosts * 8 + Math.round(totalLikes / 40))
}

/** Check if post matches active filter @param post Post to check @param activeFilter Current filter @returns Whether post matches */
export function matchesActiveFilter(post: Post, activeFilter: FilterKey) {
  switch (activeFilter) {
    case 'gamers':
      return post.is_review
    case 'posts':
      return !post.is_review
    case 'juegos':
      return post.reviewed_game.length > 0
    case 'tags':
      return post.media.hashtags.length > 0
    default:
      return true
  }
}
