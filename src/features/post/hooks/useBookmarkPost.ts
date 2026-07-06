/** Hook to toggle bookmark with optimistic update and toast feedback. */

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toggleBookmark } from '../api/post.api'
import { useToastStore } from '@/src/core/store/toast.store'
import { postKeys } from '../api/queryKeys'
import type { Post } from '@/src/core/types/post.types'

const FEED_KEY = ['fetch-feed'] as const

export const useBookmarkPost = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: (postId: string) => toggleBookmark(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.details(postId) })
      await queryClient.cancelQueries({ queryKey: FEED_KEY })

      const previousDetail = queryClient.getQueryData<Post>(postKeys.details(postId))
      const previousFeed = queryClient.getQueryData<InfiniteData<Post[]>>(FEED_KEY)

      if (previousDetail) {
        queryClient.setQueryData<Post>(postKeys.details(postId), {
          ...previousDetail,
          isSaved: !previousDetail.isSaved,
        })
      }

      if (previousFeed) {
        queryClient.setQueryData<InfiniteData<Post[]>>(FEED_KEY, {
          ...previousFeed,
          pages: previousFeed.pages.map((page) =>
            page.map((p) =>
              p.id === postId ? { ...p, isSaved: !p.isSaved } : p,
            ),
          ),
        })
      }

      return { previousDetail, previousFeed, postId }
    },
    onError: (error: any, _, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(postKeys.details(context.postId), context.previousDetail)
      }
      if (context?.previousFeed) {
        queryClient.setQueryData(FEED_KEY, context.previousFeed)
      }
      const msg = error?.response?.data?.message || 'Error al guardar'
      showToast(msg, 'error')
    },
    onSuccess: (data, postId) => {
      queryClient.setQueryData<Post>(postKeys.details(postId), (old) => {
        if (!old) return old
        return { ...old, isSaved: data.bookmarked }
      })
      queryClient.setQueryData<InfiniteData<Post[]>>(FEED_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((p) => (p.id === postId ? { ...p, isSaved: data.bookmarked } : p)),
          ),
        }
      })
      queryClient.invalidateQueries({ queryKey: postKeys.bookmarks() })
    },
  })
}
