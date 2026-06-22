/** Zustand store for posts, favorites, and mutations. */

import { create } from 'zustand'
import { mockPosts } from '@/src/mocks/mock-posts'
import type { Post } from '@/src/core/types/post.types'

/** Post list, favorite IDs, and actions to add/reload/toggle favorites. */
type PostState = {
  posts: Post[]
  favoriteIds: string[]
  lastAddedId?: string
  addPost: (post: Post) => void
  reloadPosts: () => void
  toggleFavorite: (postId: string) => void
}

const clonePost = (post: Post): Post => ({
  ...post,
  media: post.media ? {
    images: [...post.media.images],
    hashtags: [...post.media.hashtags],
  } : null,
  comments: post.comments ? post.comments.map((c) => ({ ...c })) : [],
})

// const getInitialPosts = () => mockPosts.map(clonePost)
const getInitialPosts = () => []

/** Hook returning post store state and actions. @returns PostState with posts, favoriteIds, and mutation methods */
export const usePostStore = create<PostState>((set) => ({
  posts: getInitialPosts(),
  favoriteIds: [],
  lastAddedId: undefined,

  addPost: (post) =>
    set((state) => ({
      posts: [clonePost(post), ...state.posts],
      lastAddedId: post.id,
    })),

  reloadPosts: () => set(() => ({ posts: getInitialPosts() })),

  toggleFavorite: (postId) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(postId)
        ? state.favoriteIds.filter((id) => id !== postId)
        : [...state.favoriteIds, postId],
    })),
}))
