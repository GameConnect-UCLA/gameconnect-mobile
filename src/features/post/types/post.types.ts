/** Post-related types */

/** Post media containing images and hashtags */
export interface PostMedia {
  urls: string[];
}

/** Comment on a post */
export interface Comment {
  id: string;
  author_id: string;
  authorDisplayName: string;
  authorProfilePic: string;
  content: string;
  createdAt: string;
}

/** Full post entity */
export interface Post {
  id: string;
  author: string;
  authorUser: {
    displayName: string;
    username: string;
    profilePic: string;
  }
  title: string;
  content: string;
  hashtags: string[];
  media: PostMedia | null;
  isReview: boolean;
  reviewScore?: number;
  reviewedGame?: string; 
  likesCounter: number;
  commentsCounter: number;
  comments: Comment[];
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  lastModifiedAt: string;
  deletedAt: string | null;
  isRepost: boolean, 
  originalPostId: string
}
