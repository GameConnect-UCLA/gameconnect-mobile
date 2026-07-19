import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchTrendingFeed } from '../api/explore.api'

/**
 * Hook to fetch paginated trending feed posts
 * @param limit Items per page
 * @returns useInfiniteQuery result
 */
export const useTrendingFeed = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['explore', 'trending-feed'],
    queryFn: ({ pageParam = 0 }) => fetchTrendingFeed(pageParam, limit),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.flat().length : undefined
    },
    staleTime: 30000, // 30s stale time for slower-changing trending posts
  })
}
