/** Hook to toggle like on a post with optimistic update and toast feedback. */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toggleLike } from '../api/post.api'
import { useToastStore } from '@/src/core/store/toast.store'
import { postKeys } from '../api/queryKeys'
import type { Post } from '@/src/core/types/post.types'

export const useLikePost = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: (postId: string) => toggleLike(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.details(postId) })
      const previous = queryClient.getQueryData<Post>(postKeys.details(postId))

      if (previous) {
        queryClient.setQueryData<Post>(postKeys.details(postId), {
          ...previous,
          isLiked: !previous.isLiked,
          likesCounter: previous.isLiked
            ? previous.likesCounter - 1
            : previous.likesCounter + 1,
        })
      }

      return { previous, postId }
    },
    onError: (error: AxiosError<{ message?: string }>, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postKeys.details(context.postId), context.previous)
      }
      const msg = error?.response?.data?.message || 'Error al dar like'
      showToast(msg, 'error')
    },
    onSuccess: (data, postId) => {
      queryClient.setQueryData<Post>(postKeys.details(postId), (old) => {
        if (!old) return old
        return {
          ...old,
          isLiked: data.liked,
          likesCounter: data.likesCounter,
        }
      })
    },
  })
}
