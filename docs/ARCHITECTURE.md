# Architecture — GameConnect Mobile

## Layer diagram

```
app/ (Expo Router — thin wrappers, <40 lines)
  │
  ▼ imports screens
src/features/[feature]/ (domain modules — each self-contained)
  │
  ▼ imports core + mocks
src/core/ (shared infrastructure — no feature dependency)
  │
  ▼ imports nothing from project
src/mocks/ (flat mock data — temporary, removed as backend ships)
```

**Golden rule:** `app/` is the routing map. `features/` is where work happens.
Each route in `app/` imports one screen component from `features/` and never exceeds 40 lines.

---

## Data flow by feature

| Feature | Zustand Store | TanStack Query | API Contracts | WebSocket | Own Types |
|---------|--------------|----------------|---------------|-----------|-----------|
| **auth** | `core/store/auth.store.ts` (tokens, isAuthenticated) | `useLogin`, `useSignup`, `useSessionCheck`, `useLogout` | `auth.contracts.ts` | — | `features/auth/types/auth.types.ts` |
| **chat** | `features/chat/store/chat.store.ts` (attachments, reply, mentions) | `useConversation`, `useChatList`, `useChatInfo`, `useGroupMembers`, `useAutocomplete` | `chat.contracts.ts` | `useChatSocket` | `features/chat/types/chat.types.ts` |
| **feed** | `features/feed/store/post.store.ts` (posts cache, likes) | — (local store + mock data) | `post.contracts.ts` | — | — (uses core Post) |
| **post** | — | `useCreatePost` | `post.contracts.ts` | — | `features/post/types/post.types.ts` |
| **game** | — | `useGameProfiles` | `game.contracts.ts` | — | `features/game/types/game.types.ts` |
| **profile** | — | `useCurrentUser` (mock → future TanStack Query) | — | — | `features/profile/types/user.types.ts` |
| **explore** | — | — (local data + mockPosts) | — | — | `features/explore/utils/explore.utils.ts` (local types) |
| **notifications** | — | `useNotifications` (30s staleTime) | `notifications.contracts.ts` | `useNotificationSocket` | `features/notifications/types/notifications.types.ts` |

**Cross-feature communication:** Features never import directly from other features.
Shared types live in `core/types/` which re-exports from owning feature's types.

---

## Auth flow

```
app/index.tsx → useSessionCheck()
  └─ reads access_token from expo-secure-store
  └─ if valid → auth.store.setAuthenticated(token) → router.replace('/(tabs)')
  └─ if absent → router.replace('/(auth)/login')

login.tsx → useLogin()
  └─ authApi.login(credentials) → POST /auth/login
  └─ store access_token + refresh_token in secure-store
  └─ setAuthenticated(token) + setUser(user) in Zustand
  └─ router.replace('/(tabs)') → unmounts (auth) group

HTTP interceptor (core/api/client.ts):
  └─ injects Authorization header from auth store
  └─ on 401 → tries refresh token → if fails → logout
```

The `(auth)` and `(tabs)` are mutually exclusive route groups in Expo Router.
Post-login navigation unmounts the auth group entirely via `router.replace`.

---

## Design system

Defined in `core/theme/index.ts`:

| Token | Export | Example |
|-------|--------|---------|
| Colors | `Colors.primary` | `#033563` |
| Spacing | `Spacing.lg` | `16` |
| Radii | `Radii.lg` | `18` |
| Typography | `Typography.sizes.md` | `14` |
| Shadows | `Shadows.sm` | `{ shadowColor: '#000', ... }` |

Core components (`core/components/`) are stateless UI atoms:
`Button`, `Avatar`, `SearchBar`, `DatePicker`, `AppToast`, `ConfirmDialog`, `EmptyState`, `LoadingSpinner`, `AutocompleteDropdown`.

Features import design tokens instead of hardcoding values.

---

## i18n

Located in `core/i18n/es.ts`. Single flat object organized by domain:

```typescript
strings.chat.input.placeholder  // 'Mensaje...'
strings.feed.like               // 'Me gusta'
strings.profile.settings        // 'Configuración'
```

No external i18n library — overhead not justified for a single-language app.
To add new strings, edit `es.ts` and reference `strings.<domain>.<key>`.

---

## WebSocket

| Layer | File | Purpose |
|-------|------|---------|
| Real client | `core/api/socket.ts` | socket.io-client connection to NestJS backend |
| Mock | `core/api/mock-socket.ts` | Emits mock events for development without backend |
| Chat consumer | `features/chat/hooks/useChatSocket.ts` | Receives/sends chat messages |
| Notification consumer | `features/notifications/hooks/useNotificationSocket.ts` | Receives live notifications |

**Current state:** Mocks are active. Backend development starts this week.
Mocks will be progressively removed as backend endpoints become stable.

---

## HTTP system

| Component | File | Role |
|-----------|------|------|
| Axios client | `core/api/client.ts` | Base URL, JWT interceptor, 401→refresh |
| Error class | `core/api/ApiError.ts` | Typed error with status code |
| Mock handlers | `core/api/mocks/` | Intercept requests during dev |
| Contracts | `core/api/contracts/` | Request/response interfaces shared with NestJS |

**Current state:** Contracts are aspirational — they define the desired API shape
but will be modified as the backend implements each endpoint.

---

## Non-obvious design decisions

### useNavigation throttle (500ms)
`core/hooks/useNavigation.ts` wraps `expo-router`'s `useRouter()` with a 500ms
throttle to prevent rapid-tap stacking (pressing a button 3 times in 200ms
stacks 3 screens). Migrated 26 `router.push()` calls across 15 files.

### Global ConfirmDialog + AppToast
Instead of 35+ scattered `Alert.alert()` calls, the app uses:
- `core/components/ConfirmDialog.tsx` — modal for yes/no confirmations
- `core/components/AppToast.tsx` — transient feedback (success, error, warning, info)
- Both are rendered once in `app/_layout.tsx` and consumed via Zustand stores

### PostCard variant
`PostCard` accepts a `variant: 'feed' | 'profile'` prop that unifies the
former `PostItem` (used in profile) and `PostCard` (used in feed/explore).
`variant='profile'` produces a simplified layout without the multiple-image
gallery.

### normalizeText
Accent-insensitive text normalization is defined in `core/utils/string.ts`
and used by search/filter features. It was duplicated in `explore.utils.ts`;
the copy was removed in the documentation pass and consumers migrated to the
canonical version.

### Stubs removed
5 stub files (re-exports and placeholders) were removed during the
documentation cleanup:
- `features/auth/store/auth.store.ts` — consumers now import directly from `core/store/auth.store`
- `features/chat/hooks/useChatInput.ts` — placeholder, no consumers
- `features/profile/components/PostItem.tsx` — consumers now import `PostItem` from `features/feed/components/PostCard`
- `features/game/components/GameSearchModal.tsx` — consumers now import from `features/chat/components/common/GameSearchModal`
- `features/game/components/GameInfoCardDisplay.tsx` — placeholder, no consumers

---

## Technical debt

| Item | Location | Impact |
|------|----------|--------|
| Post vs UserPost unified | `core/types/` | Formerly two types for one concept (Post had 13 fields, UserPost had 9 incompatible fields). Unified into canonical Post with `is_liked`, `is_saved` added. |
| useChatSearch stub | `features/chat/hooks/useChatSearch.ts:7` | `// TODO: return await apiClient.get(...)` — no backend endpoint yet |
| explore.utils.ts placeholder | `features/explore/utils/explore.utils.ts:25` | `{ key: 'todo', label: 'TODO', ... }` is a placeholder filter category |
| normalizeText was duplicated | `explore.utils.ts` (removed) | Now only lives in `core/utils/string.ts` |
| Contracts aspirational | `core/api/contracts/` | Interface shapes will change as backend implements them |
| Mocks temporary | `src/mocks/` + `core/api/mocks/` | Will be removed as backend ships |
| Mock ID mismatch | `mock-chat.ts` | `ACTIVE_USERS.id "1"` vs `CONVERSATIONS.members.user_id "user1"` — known, non-blocking for dev |

---

## Related documents

- [CONVENTIONS.md](../CONVENTIONS.md) — code style, naming, folder structure
- [dbschema.md](./dbschema.md) — database schema definition
- [schema-gaps.md](./schema-gaps.md) — frontend fields missing from DB schema
- [chat/refactor_plan.md](./chat/refactor_plan.md) — full refactor plan (Fase 1-4)
- [post-userpost-unification.md](./post-userpost-unification.md) — analysis of type unification
- [ONBOARDING.md](./ONBOARDING.md) — setup guide for new developers
