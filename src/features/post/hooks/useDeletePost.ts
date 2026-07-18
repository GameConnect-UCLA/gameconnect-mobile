/** Hook to delete a post with cache invalidation and toast feedback. */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '../api/post.api'
import { useToastStore } from '@/src/core/store/toast.store'
import { postKeys } from '../api/queryKeys'

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Error al eliminar'
      showToast(msg, 'error')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.feed() })
      showToast('Publicación eliminada', 'success')
    },
  })
}
