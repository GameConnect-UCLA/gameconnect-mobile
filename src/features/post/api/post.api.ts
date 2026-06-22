/** Post API functions */
import { apiClient } from '@/src/core/api/client'
import type { Post } from '@/src/core/types/post.types'

/** Fetch all posts @returns Post list */
export const fetchFeed = async (offset: number = 0, limit: number = 10): Promise<Post[]> => {
  const { data } = await apiClient.get<Post[]>(`/feed?limit=${limit}&offset=${offset}`)
  return data
}

/** Fetch all posts @returns Post list */
export const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await apiClient.get<Post[]>('/posts')
  return data
}

/** Fetch post by ID @param id Post ID @returns Post */
export const fetchPostById = async (id: string): Promise<Post> => {
  const { data } = await apiClient.get<Post>(`/posts/${id}`)
  return data
}

/** Create a new post @param post Partial post data @returns Created post */
export const createPost = async (post: Partial<Post>): Promise<Post> => {
  const { data } = await apiClient.post<Post>('/posts', post)
  return data
}

/** Update a post @param id Post ID @param post Partial post data @returns Updated post */
export const updatePost = async (id: string, post: Partial<Post>): Promise<Post> => {
  const { data } = await apiClient.put<Post>(`/posts/${id}`, post)
  return data
}

/** Delete a post @param id Post ID */
export const deletePost = async (id: string): Promise<void> => {
  await apiClient.delete(`/posts/${id}`)
}

/** Toggle like on a post @param postId Post ID @returns Like state */
export const toggleLike = async (postId: string): Promise<{ post_id: string; liked: boolean; likes_counter: number }> => {
  const { data } = await apiClient.post('/posts/like', { postId })
  return data
}

/** Toggle bookmark on a post @param postId Post ID @returns Bookmark state */
export const toggleBookmark = async (postId: string): Promise<{ post_id: string; bookmarked: boolean }> => {
  const { data } = await apiClient.post('/posts/bookmark', { postId })
  return data
}
