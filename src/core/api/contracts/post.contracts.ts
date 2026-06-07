/** Frontend ↔ Backend API contracts for Post module. */
/** Payload to create a new post. */
export interface CreatePostRequest {
  author: string
  content: string
  media?: PostMediaPayload
  is_review?: boolean
  is_repost?: boolean
  reviewed_game?: string | null
  original_post_id?: string | null
}

/** Payload to update an existing post. */
export interface UpdatePostRequest {
  content?: string
  media?: PostMediaPayload
}

/** Media attached to a post (images + hashtags). */
export interface PostMediaPayload {
  images: string[]
  hashtags?: string[]
}

/** Full post data returned by the server. */
export interface PostResponse {
  id: string
  author: string
  author_display_name: string
  author_username: string
  author_profile_pic: string
  content: string
  media: PostMediaPayload
  is_review: boolean
  is_repost: boolean
  reviewed_game: string | null
  review_score: number | null
  likes_counter: number
  comments_counter: number
  created_at: string
  last_modified_at: string
  deleted_at: string | null
}

/** Paginated list of posts. */
export interface PostsListResponse {
  posts: PostResponse[]
  total: number
  page: number
  page_size: number
}

/** Payload to toggle like on a post. */
export interface ToggleLikeRequest {
  post_id: string
}

/** Response after toggling like. */
export interface ToggleLikeResponse {
  post_id: string
  liked: boolean
  likes_counter: number
}

/** Payload to toggle bookmark on a post. */
export interface ToggleBookmarkRequest {
  post_id: string
}

/** Response after toggling bookmark. */
export interface ToggleBookmarkResponse {
  post_id: string
  bookmarked: boolean
}
