/** Game-related types */

/** Review for a game */
export interface GameReview {
  id: string
  user_username: string
  user_profilePic: string
  rating: number
  game_title: string
  review_text: string
  attached_imageUrl?: string
  createdAt: string
}

/** Game profile entity */
export interface GameProfile {
  id: string
  title: string
  developer: string
  coverUrl: string
  background_url: string
  score: number
  rating_count: number
  tags: string[]
  description: string
  reviews: GameReview[]
}
