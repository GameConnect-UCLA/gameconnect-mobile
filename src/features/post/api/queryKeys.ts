/** Centralized query keys for post module. Single source of truth for cache invalidation. */

export const postKeys = {
  all: ['posts'] as const,
  feed: (params?: { limit?: number; offset?: number }) =>
    [...postKeys.all, 'feed', params] as const,
  comments: (postId: string) =>
    [...postKeys.all, 'comments', postId] as const,
  bookmarks: (params?: { limit?: number; offset?: number }) =>
    [...postKeys.all, 'bookmarks', params] as const,
  details: (id: string) =>
    [...postKeys.all, id] as const,
}
