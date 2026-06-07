/** Post-related types */

/** Post media containing images and hashtags */
export interface PostMedia {
  images: string[];
  hashtags: string[];
}

/** Comment on a post */
export interface Comment {
  id: string;
  author_id: string;
  author_display_name: string;
  author_profile_pic: string;
  content: string;
  created_at: string;
}

/** Full post entity */
export interface Post {
  id: string;
  author: string;
  author_display_name: string;
  author_username: string;
  author_profile_pic: string;
  post_title: string;
  content: string;
  media: PostMedia;
  is_review: boolean;
  review_score: number | null;
  reviewed_game: string;
  likes_counter: number;
  comments_counter: number;
  comments: Comment[];
  is_liked?: boolean;
  is_saved?: boolean;
  created_at: string;
  last_modified_at: string;
  deleted_at: string | null;
}
