/** Hook to fetch comments for a post. */

import { useQuery } from '@tanstack/react-query'
import { getPostComments } from '../api/post.api'
import { postKeys } from '../api/queryKeys'

export const usePostComments = (postId: string, params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: () => getPostComments(postId, params),
    enabled: !!postId,
  })
}
