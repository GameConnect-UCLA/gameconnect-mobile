/** Hook to fetch bookmarked posts with pagination. */

import { useInfiniteQuery } from '@tanstack/react-query'
import { getBookmarkedPosts } from '../api/post.api'
import { postKeys } from '../api/queryKeys'

export const useFetchBookmarks = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: postKeys.bookmarks(),
    queryFn: ({ pageParam = 0 }) => getBookmarkedPosts({ limit, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < limit) return undefined
      return allPages.length * limit
    },
    initialPageParam: 0,
  })
}
