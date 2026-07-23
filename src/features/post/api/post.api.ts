/** Post API functions */
import { apiClient } from '@/src/core/api/client'
import { mediaApi } from '@/src/core/api/media'
import type { Post, Comment } from '@/src/core/types/post.types'

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

/** Fetch posts published by a user @returns Post list */
export const fetchUserPosts = async (userId: string, offset: number = 0, limit: number = 10): Promise<Post[]> => {
  const { data } = await apiClient.get<Post[]>('/posts/user', { params: { userId, limit, offset } })
  return data
}

/** Create a new post @param post Partial post data @returns Created post */
// post.api.ts - createPost
export const createPost = async (post: Partial<Post>): Promise<Post> => {
  const { media } = post;
  let imageUrls: string[] = [];

  if (media?.urls?.length) {
    try {
      const uploadPromises = media.urls.map(async (localImg) => {
        const fileName = `${post.title}`.split(" ").join("").toLowerCase();
        const mimeType = "image/" + (localImg.split('.').pop() ?? 'jpg');
        console.log(`Uploading: ${localImg} as ${fileName} (${mimeType})`);
        const data = await mediaApi.uploadFile(localImg, fileName, mimeType);
        return data.url;

      });
      imageUrls = await Promise.all(uploadPromises);
    } catch (error:any) {
      console.error('Error uploading images:', error.response);
      throw new Error('Failed to upload one or more images');
    }
  }

  // imageUrls.forEach(img => console.info(img))

  const request = {
  title: post.title,
  content: post.content,
  media: {
    urls: imageUrls
  },
  hashtags: post.hashtags,
  isReview: post.isReview,
  reviewedGame: post.reviewedGame,
  reviewScore: post.reviewScore,
  isRepost: post.isRepost,
}

  const { data } = await apiClient.post<Post>('/posts', request);
  return data;
};

/** Update post content @param id Post ID @param content New content @returns Updated post */
export const updatePost = async (id: string, content: string): Promise<Post> => {
  const { data } = await apiClient.patch<Post>(`/posts/${id}`, { content })
  return data
}

/** Delete a post @param id Post ID */
export const deletePost = async (id: string): Promise<void> => {
  await apiClient.delete(`/posts/${id}`)
}

/** Toggle like on a post @param postId Post ID @returns Like state */
export const toggleLike = async (postId: string): Promise<{ postId: string; liked: boolean; likesCounter: number }> => {
  const { data } = await apiClient.post('/posts/like', { postId })
  return data
}

/** Toggle bookmark on a post @param postId Post ID @returns Bookmark state */
export const toggleBookmark = async (postId: string): Promise<{ postId: string; bookmarked: boolean }> => {
  const { data } = await apiClient.post(`/posts/${postId}/bookmark`)
  return data
}

/** Fetch comments for a post @param postId Post ID @returns Comment list */
export const getPostComments = async (postId: string, params?: { limit?: number; offset?: number }): Promise<Comment[]> => {
  const { data } = await apiClient.get(`/posts/${postId}/comments`, { params })
  return data
}

/** Create a comment on a post @param postId Post ID @param content Comment content @returns Created comment */
export const createComment = async (postId: string, content: string): Promise<Comment> => {
  const { data } = await apiClient.post(`/posts/${postId}/comment`, { content })
  return data
}

/** Fetch bookmarked posts @param params Pagination @returns Post list */
export const getBookmarkedPosts = async (params?: { limit?: number; offset?: number }): Promise<Post[]> => {
  const { data } = await apiClient.get('/users/me/favorites', { params })
  return data
}
