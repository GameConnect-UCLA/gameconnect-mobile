export interface PostMedia {
  images: string[];
  hashtags: string[];
}

export interface Comment {
  id: string;
  author_display_name: string;
  author_profile_pic: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  autor: string;
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
  commets_counter: number;
  comments: Comment[];
  created_at: string;
  last_modified_at: string;
  deleted_at: string | null;
}
