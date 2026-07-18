# Action Plan — Review Fixes

Post-review fixes for frontend-backend integration (caveman review 2026-07-05).

---

## Critical (will cause visible bugs)

### Fix 1.2 — useLikePost onSuccess redundant feed invalidation
- **File**: `src/features/post/hooks/useLikePost.ts:38-46`
- **Problem**: `onSuccess` invalidates feed after optimistic update already applied. Causes flicker + wasted fetch.
- **Fix**: Remove `invalidateQueries({ queryKey: postKeys.feed() })` from onSuccess. Keep optimistic update in onMutate.
- **Risk**: Very low

### Fix 1.4 — Infinite query fetchNextPage race condition
- **File**: `src/features/feed/components/FavoritesScreen.tsx:92-95`
- **Problem**: `onEndReached` may fire multiple times on fast scroll.
- **Fix**: Verify guard `if (hasNextPage && !isFetchingNextPage) fetchNextPage()` exists. Add if missing.
- **Risk**: Very low

### Fix 1.1 — Logout race condition
- **Files**: `src/features/auth/hooks/useLogout.ts`, `src/features/profile/components/SettingsView.tsx`
- **Problem**: `replace("/(auth)/login")` called before tokens cleared. User navigated while still authenticated.
- **Fix**: Move `replace()` to `onSuccess` callback. Change `onSettled` → `onSuccess` for cleanup.
- **Risk**: Low (standard callback pattern)

### Fix 1.3 — PostCard dual state
- **File**: `src/features/feed/components/PostCard.tsx`
- **Problem**: `isLiked` for card variant, `isItemLiked` for item variant. DRY violation.
- **Fix**: Extract item variant to sub-component `<ItemVariant />` in same file. Scope state to sub-component.
- **Risk**: Medium (refactor, no logic change)

---

## Medium (potential bugs, state consistency)

### Fix 2.1 — PostId memoization
- **File**: `src/features/post/components/PostDetailView.tsx:43`
- **Problem**: `usePostComments(post.id)` re-runs if parent re-renders with new object ref.
- **Fix**: `const postId = useMemo(() => post.id, [post.id])`
- **Risk**: Very low

### Fix 2.2 — useCreateComment double-render
- **File**: `src/features/post/hooks/useCreateComment.ts:42-44`
- **Problem**: `invalidateQueries` + optimistic append causes temp comment to flash.
- **Fix**: On success, replace temp comment (id starts with `temp-`) with real comment from server.
- **Risk**: Low (UX improvement)

### Fix 2.3 — Error typing any → AxiosError
- **Files**: `useLikePost.ts`, `useLogout.ts`, `useCreateComment.ts`
- **Problem**: `error: any` defeats TypeScript type safety.
- **Fix**: Type as `AxiosError<{ message?: string }>`.
- **Risk**: Very low (type fix)

### Fix 2.4 — useLogout onSettled always runs
- **File**: `src/features/auth/hooks/useLogout.ts:25-28`
- **Problem**: Cleanup on error is confusing.
- **Fix**: Move cleanup to `onSuccess` only.
- **Risk**: Low

---

## Low (code quality, non-critical UX)

### Fix 3.1 — Unused import
- **File**: `src/features/feed/components/FavoritesScreen.tsx:27`
- **Problem**: `toggleFavorite` from usePostStore imported but never called.
- **Fix**: Remove import.
- **Risk**: Very low

### Fix 3.2 — Query key flat arrays
- **File**: `src/features/post/api/queryKeys.ts:5-10`
- **Problem**: Object params as query key → cache miss if object shape differs.
- **Fix**: Use flat arrays: `['posts', 'feed', limit, offset]`.
- **Risk**: Very low (optimization)

### Fix 3.3 — itemLikesCount sync
- **File**: `src/features/feed/components/PostCard.tsx:96-97`
- **Problem**: `itemLikesCount` state never syncs with `itemLikes` prop.
- **Fix**: Derive from prop: `const displayItemLikes = itemLikesCount || itemLikes`.
- **Risk**: Very low

### Fix 3.5 — EmptyState + toast in mock voids
- **Files**: `CreatePostScreen.tsx`, `ExploreScreen.tsx`, `GameProfileView.tsx`
- **Problem**: Features with `[]` return show nothing.
- **Fix**: Add EmptyState component + toast "feature coming soon" on user action.
- **Risk**: Very low (UX improvement)

---

## Execution Order

1. Fix 1.2 — useLikePost (2 min)
2. Fix 1.4 — fetchNextPage guard (2 min)
3. Fix 1.1 — logout race (5 min)
4. Fix 2.1 — postId memo (3 min)
5. Fix 2.4 — onSettled → onSuccess (3 min)
6. Fix 3.2 — query keys flat (5 min)
7. Fix 2.3 — error types (10 min)
8. Fix 1.3 — PostCard split (20 min)
9. Fix 2.2 — comment replacement (5 min)
10. Fix 3.1 — remove unused import (1 min)
11. Fix 3.3 — sync itemLikesCount (3 min)
12. Fix 3.5 — EmptyState + toast (10 min)

**Total**: ~70 minutes | **Commits**: 6 semantic commits
