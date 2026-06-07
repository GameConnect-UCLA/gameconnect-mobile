# Post/UserPost Unification Analysis

## Current state

Two separate types represent the same concept (a post):

### `Post` (`src/types/post.types.ts` — actual data definition)

```typescript
interface Post {
  id: string;
  author: string;
  author_display_name: string;
  author_username: string;
  author_profile_pic: string;
  post_title: string;
  content: string;
  media: PostMedia;         // { images: string[], hashtags: string[] }
  is_review: boolean;
  review_score: number | null;
  reviewed_game: string;
  likes_counter: number;
  comments_counter: number;
  comments: Comment[];
  created_at: string;
  last_modified_at: string;
  deleted_at: string | null;
}
```

Used by: mock-posts, PostCard, PostDetailView, post.api, useCreatePost, ProfileView, ExploreScreen, GameProfileView, explore.utils.

### `UserPost` (`src/types/user.types.ts` — simplified variant)

```typescript
interface UserPost {
  id: string;
  title: string;            // same as Post.post_title
  content: string;
  image_url: string;         // single image vs Post.media.images[]
  likes: number;             // same as Post.likes_counter
  comments_count: number;    // same as Post.comments_counter
  is_liked?: boolean;        // not in Post
  is_saved?: boolean;        // not in Post
  comments_list?: UserPostComment[];  // same as Post.comments
}
```

Used by: only as type re-export from core/types/index.ts. No actual code accesses `UserPost` fields directly — it lives inside `User.posts: UserPost[]` but nothing iterates over it.

### `UserPostComment` vs `Comment`

| UserPostComment | Comment |
|---|---|
| `user_name: string` | `author_display_name: string` |
| `user_avatar: string` | `author_profile_pic: string` |
| `text: string` | `content: string` |
| `date: string` | `created_at: string` |

## Unification

1. Add `is_liked?: boolean` and `is_saved?: boolean` to `Post`
2. Replace `UserPost[]` with `Post[]` in `User`
3. Replace `UserPostComment[]` (comments_list) with `Comment[]` in `User`
4. Delete `UserPost` and `UserPostComment` interfaces
5. Remove from barrel re-exports
6. No code breakage: nothing accesses `User.posts`, `UserPost` fields, or `UserPostComment` fields directly

**Result**: One canonical `Post` type used everywhere.
