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
  authorDisplayName: string;
  author_profilePic: string;
  content: string;
  createdAt: string;
}

/** Full post entity */
export interface Post {
  id: string;
  author: string;
  authorDisplayName: string;
  authorUsername: string;
  author_profilePic: string;
  postTitle: string;
  content: string;
  media: PostMedia | null;
  is_review: boolean;
  review_score: number | null;
  reviewed_game: string;
  likes_counter: number;
  commentsCounter: number;
  comments: Comment[];
  is_liked?: boolean;
  is_saved?: boolean;
  createdAt: string;
  last_modified_at: string;
  deletedAt: string | null;
}
