import { apiClient } from '@/src/core/api/client'
import type { Post } from '@/src/features/post/types/post.types'
import type { SearchResponse } from '../types/explore.types'

/** Parameters for search API request */
export interface SearchParams {
  q?: string
  type?: 'post' | 'user' | 'game'
  hashtag?: string
  limit?: number
  offset?: number
}

/**
 * Searches posts, users, or games
 * @param params Search parameters (q, type, hashtag, limit, offset)
 * @returns Promise resolving to SearchResponse
 */
export const search = async (params: SearchParams): Promise<SearchResponse> => {
  const { data } = await apiClient.get<SearchResponse>('/search', { params })
  return data
}

/**
 * Fetches the trending posts feed
 * @param offset Result offset for pagination
 * @param limit Result limit per page
 * @returns Promise resolving to list of trending posts
 */
export const fetchTrendingFeed = async (offset: number = 0, limit: number = 10): Promise<Post[]> => {
  const { data } = await apiClient.get<Post[]>('/feed/trending', {
    params: { offset, limit },
  })
  return data
}
