# Future Works

Features deferred from frontend-backend integration review (2026-07-05).

---

## Retry Logic for Mutations

**Status**: Deferred
**Priority**: Medium
**Impact**: Network hiccup → failed like/bookmark/comment → inconsistent UI until page refresh.

### What

Add retry with exponential backoff to all mutation hooks (`useLikePost`, `useCreateComment`, `useBookmarkPost`, `useDeletePost`, `useUpdatePost`).

### How

TanStack Query supports `retry` option natively:

```ts
useMutation({
  mutationFn: ...,
  retry: 3,                        // retry 3 times
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // exponential backoff
})
```

Or custom:

```ts
retry: (failureCount, error) => {
  if (error.response?.status >= 500) return failureCount < 3
  if (error.response?.status === 429) return failureCount < 5
  return false // don't retry 4xx
}
```

### UX Considerations

- Show "Retrying..." state instead of immediate error toast
- Only show error toast after all retries exhausted
- Consider retry-now button in toast for user-initiated retry

---

## Offline Queue

**Status**: Deferred
**Priority**: Low
**Impact**: No mutations work offline. User creates comment without connectivity → lost.

### What

Queue mutations locally when offline, execute when connectivity restored.

### How

- Detect online/offline via `NetInfo`
- Store pending mutations in Zustand/AuthStore or SQLite
- Flush queue on reconnect
- Conflict resolution: last-write-wins or CRDT

### Dependencies

- `@react-native-community/netinfo`
- Offline-first mutation adapter

---

## Optimistic Feed Update

**Status**: Deferred
**Priority**: Medium
**Impact**: After like/bookmark in PostCard, feed list doesn't update until scroll refresh.

### What

When mutating a post (like/bookmark/comment), also update the post in the feed cache without refetching whole feed.

### How

```ts
onMutate: (postId) => {
  // Update post in feed cache
  queryClient.setQueriesData<Post[]>(
    { queryKey: postKeys.feed() },
    (old) => old?.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked } : p)
  )
}
```

### Caveats

- Feed is paginated. Need to find which page the post is on.
- May conflict with infinite query pagination structure.

---

## TanStack Query DevTools

**Status**: Deferred
**Priority**: Low
**Impact**: Hard to debug cache state, mutations, query keys.

### What

Enable `@tanstack/react-query-devtools` in dev mode.

### How

```tsx
// In app/_layout.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

{__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
```

---

## Query Key Monitoring / Linting

**Status**: Deferred
**Priority**: Low
**Impact**: Manual invalidation prone to typos, missing keys.

### What

Auto-generate query keys from endpoint URLs or use ESLint plugin to validate.

### How

- `@tanstack/eslint-plugin-query`
- Auto-complete for queryKey via TypeScript

---

## Backend Endpoints (from docs/backend-gaps.md)

**Status**: Needs backend team
**Priority**: Varies

- Password reset flow (forgot/reset)
- User follow/unfollow
- Game search API
- User search API
- Chat search API
- Active/friends users API

See `docs/backend-gaps.md` for full priority list.
