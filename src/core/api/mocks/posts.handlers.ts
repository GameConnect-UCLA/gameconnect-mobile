import { mockRoutes } from './index'
import { mockPosts } from '@/src/mocks/mock-posts'

mockRoutes.set('/posts', (config) => {
  if (!config.data) return mockPosts
  const body = JSON.parse(config.data || '{}')
  return {
    id: `post-${Date.now()}`,
    ...body,
    likes_counter: 0,
    commentsCounter: 0,
    createdAt: new Date().toISOString(),
    last_modified_at: new Date().toISOString(),
    deletedAt: null,
  }
})

mockRoutes.set('/posts/', (config) => {
  const id = config.url?.replace('/posts/', '')
  if (!id) return mockPosts
  const post = mockPosts.find((p) => p.id === id)
  if (!post) throw { status: 404, message: 'Post not found' }
  return post
})

mockRoutes.set('/posts/like', (config) => {
  const { postId } = JSON.parse(config.data || '{}')
  return { postId, liked: true, likes_counter: 42 }
})

mockRoutes.set('/posts/bookmark', (config) => {
  const { postId } = JSON.parse(config.data || '{}')
  return { postId, bookmarked: true }
})
