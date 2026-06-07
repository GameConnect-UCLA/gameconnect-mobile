/** Game-related types */

/** Review for a game */
export interface GameReview {
  id: string
  user_username: string
  user_profile_pic: string
  rating: number
  game_title: string
  review_text: string
  attached_image_url?: string
  created_at: string
}

/** Game profile entity */
export interface GameProfile {
  id: string
  title: string
  developer: string
  cover_url: string
  background_url: string
  score: number
  rating_count: number
  tags: string[]
  description: string
  reviews: GameReview[]
}
