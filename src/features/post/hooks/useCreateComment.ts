/** Hook to create a comment with optimistic update and toast feedback. */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { createComment } from '../api/post.api'
import { useToastStore } from '@/src/core/store/toast.store'
import { postKeys } from '../api/queryKeys'
import type { Comment } from '@/src/core/types/post.types'

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)
  const queryKey = postKeys.comments(postId)

  return useMutation({
    mutationFn: (content: string) => createComment(postId, content),
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<Comment[]>(queryKey)
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        authorUser: {
          displayName: '...',
          username: '',
          profilePic: '',
        },
        content,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData<Comment[]>(queryKey, (old) =>
        old ? [...old, optimisticComment] : [optimisticComment]
      )

      return { previous }
    },
    onError: (error: AxiosError<{ message?: string }>, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
      const msg = error?.response?.data?.message || 'Error al comentar'
      showToast(msg, 'error')
    },
    onSuccess: (realComment) => {
      queryClient.setQueryData<Comment[]>(queryKey, (old) => {
        if (!old) return [realComment]
        return old.map((c) =>
          c.id.startsWith('temp-') ? realComment : c
        )
      })
    },
  })
}
