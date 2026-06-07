/** Post creation hooks */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../api/post.api'
import { usePostStore } from '@/src/features/feed/store/post.store'
import type { Post } from '@/src/core/types/post.types'

/** Hook to create a post, adds to store and invalidates cache @returns Mutation object */
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const addPost = usePostStore((s) => s.addPost)

  return useMutation({
    mutationFn: (post: Partial<Post>) => createPost(post),
    onSuccess: (newPost) => {
      addPost(newPost)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/** Hook to toggle like on a post @returns Mutation object */
export const useToggleLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => toggleLikeApi(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

async function toggleLikeApi(postId: string) {
  const { toggleLike } = await import('../api/post.api')
  return toggleLike(postId)
}
