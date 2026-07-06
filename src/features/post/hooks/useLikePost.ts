/** Hook to toggle like on a post with optimistic update and toast feedback. */

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toggleLike } from '../api/post.api'
import { useToastStore } from '@/src/core/store/toast.store'
import { postKeys } from '../api/queryKeys'
import type { Post } from '@/src/core/types/post.types'

const FEED_KEY = ['fetch-feed'] as const

export const useLikePost = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: (postId: string) => toggleLike(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.details(postId) })
      await queryClient.cancelQueries({ queryKey: FEED_KEY })

      const previousDetail = queryClient.getQueryData<Post>(postKeys.details(postId))
      const previousFeed = queryClient.getQueryData<InfiniteData<Post[]>>(FEED_KEY)

      if (previousDetail) {
        const delta = previousDetail.isLiked ? -1 : 1
        queryClient.setQueryData<Post>(postKeys.details(postId), {
          ...previousDetail,
          isLiked: !previousDetail.isLiked,
          likesCounter: previousDetail.likesCounter + delta,
        })
      }

      if (previousFeed) {
        queryClient.setQueryData<InfiniteData<Post[]>>(FEED_KEY, {
          ...previousFeed,
          pages: previousFeed.pages.map((page) =>
            page.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    isLiked: !p.isLiked,
                    likesCounter: p.isLiked ? p.likesCounter - 1 : p.likesCounter + 1,
                  }
                : p,
            ),
          ),
        })
      }

      return { previousDetail, previousFeed, postId }
    },
    onError: (error: AxiosError<{ message?: string }>, _, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(postKeys.details(context.postId), context.previousDetail)
      }
      if (context?.previousFeed) {
        queryClient.setQueryData(FEED_KEY, context.previousFeed)
      }
      const msg = error?.response?.data?.message || 'Error al dar like'
      showToast(msg, 'error')
    },
    onSuccess: (data, postId) => {
      queryClient.setQueryData<Post>(postKeys.details(postId), (old) => {
        if (!old) return old
        return { ...old, isLiked: data.liked }
      })
      queryClient.setQueryData<InfiniteData<Post[]>>(FEED_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((p) => (p.id === postId ? { ...p, isLiked: data.liked } : p)),
          ),
        }
      })
    },
  })
}
