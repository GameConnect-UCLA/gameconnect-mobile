/** Frontend ↔ Backend API contracts for Game module. */
/** Full game profile with rating and metadata. */
export interface GameProfileResponse {
  id: string
  title: string
  developer: string
  cover_url: string
  background_url: string
  score: number
  rating_count: number
  tags: string[]
  description: string
}

/** Search query for games. */
export interface SearchGamesRequest {
  q: string
}

/** User review for a game. */
export interface GameReviewResponse {
  id: string
  user_username: string
  user_profile_pic: string
  rating: number
  game_title: string
  review_text: string
  attached_image_url?: string
  created_at: string
}
