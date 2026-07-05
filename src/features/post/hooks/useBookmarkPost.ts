/** Hook to toggle bookmark with optimistic update and toast feedback. */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleBookmark } from '../api/post.api'
import { useToastStore } from '@/src/core/store/toast.store'
import { postKeys } from '../api/queryKeys'
import type { Post } from '@/src/core/types/post.types'

export const useBookmarkPost = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: (postId: string) => toggleBookmark(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.details(postId) })
      const previous = queryClient.getQueryData<Post>(postKeys.details(postId))

      if (previous) {
        queryClient.setQueryData<Post>(postKeys.details(postId), {
          ...previous,
          isSaved: !previous.isSaved,
        })
      }

      return { previous, postId }
    },
    onError: (error: any, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postKeys.details(context.postId), context.previous)
      }
      const msg = error?.response?.data?.message || 'Error al guardar'
      showToast(msg, 'error')
    },
    onSuccess: (data, postId) => {
      queryClient.setQueryData<Post>(postKeys.details(postId), (old) => {
        if (!old) return old
        return {
          ...old,
          isSaved: data.bookmarked,
        }
      })
      queryClient.invalidateQueries({ queryKey: postKeys.bookmarks() })
    },
  })
}
