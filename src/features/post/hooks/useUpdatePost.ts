/** Hook to update post content with cache invalidation and toast feedback. */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePost } from '../api/post.api'
import { useToastStore } from '@/src/core/store/toast.store'
import { postKeys } from '../api/queryKeys'

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updatePost(id, content),
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Error al actualizar'
      showToast(msg, 'error')
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.details(id) })
      queryClient.invalidateQueries({ queryKey: postKeys.feed() })
      showToast('Publicación actualizada', 'success')
    },
  })
}
