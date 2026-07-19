import { useInfiniteQuery } from '@tanstack/react-query'
import { search, type SearchParams } from '../api/explore.api'

interface UseSearchOptions {
  q?: string
  type?: 'post' | 'user' | 'game'
  hashtag?: string
  limit?: number
  enabled?: boolean
}

/**
 * Hook to execute search queries with infinite scrolling pagination
 * @param options Query filters and pagination settings
 * @returns useInfiniteQuery result
 */
export const useSearch = ({ q, type, hashtag, limit = 10, enabled = true }: UseSearchOptions) => {
  return useInfiniteQuery({
    queryKey: ['explore', 'search', { q, type, hashtag, limit }],
    queryFn: ({ pageParam = 0 }) => {
      const params: SearchParams = {
        limit,
        offset: pageParam,
      }
      if (q) params.q = q
      if (type) params.type = type
      if (hashtag) params.hashtag = hashtag

      return search(params)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
    enabled,
    staleTime: 10000, // 10s stale time for active searches
  })
}
