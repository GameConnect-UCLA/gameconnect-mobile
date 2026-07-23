import type { Post } from '@/src/features/post/types/post.types'

/** Search hit variant for posts */
export type SearchHitPost = Post & {
  type: 'post'
  username?: string
  displayName?: string
  profilePic?: string
}

/** Search hit variant for users */
export interface SearchHitUser {
  id: string
  username: string
  displayName: string
  searchableText?: string
  type: 'user'
  rankingScore?: number
  bio?: string
  profilePic?: string
  verified?: boolean
}

/** Search hit variant for games */
export interface SearchHitGame {
  id: string
  name: string
  searchableText?: string
  type: 'game'
  rankingScore?: number
  metadata: {
    description?: string
    coverImage?: string
  }
  score?: number
}

/** Combined search hit union type */
export type SearchHit = SearchHitPost | SearchHitUser | SearchHitGame

/** Complete search response structure */
export interface SearchResponse {
  hits: SearchHit[]
  total: number
  limit: number
  offset: number
}
