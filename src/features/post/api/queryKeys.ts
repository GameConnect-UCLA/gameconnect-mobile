/** Centralized query keys for post module. */

export const postKeys = {
  all: ['posts'] as const,
  feed: (limit?: number, offset?: number) =>
    ['posts', 'feed', limit, offset] as const,
  comments: (postId: string) =>
    ['posts', 'comments', postId] as const,
  bookmarks: (limit?: number, offset?: number) =>
    ['posts', 'bookmarks', limit, offset] as const,
  details: (id: string) =>
    ['posts', id] as const,
}
