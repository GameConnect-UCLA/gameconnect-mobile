// types/game.types.ts

export interface GameReview {
  id: string;
  user_username: string;
  user_profile_pic: string;
  rating: number; // 1 to 5
  game_title: string;
  review_text: string;
  attached_image_url?: string; // Opcional
  created_at: string;
}

export interface GameProfile {
  id: string;
  title: string;
  developer: string;
  cover_url: string; // La imagen de portada que se ve arriba
  background_url: string; // La imagen de fondo degradada
  rating_score: string; // ej: "4.5 / 5"
  rating_count: string; // ej: "(1.2k)"
  tags: string[];
  description: string;
  reviews: GameReview[];
}