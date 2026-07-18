# AGENTS.md — GameConnect Mobile

Guía para agentes de IA. Reglas de oro que debes seguir sin excepción. Convenciones completas en [CONVENTIONS.md](./CONVENTIONS.md).

---

## Golden Rules

1. **`app/` is a thin wrapper.** Zero business logic. Every route imports a screen from `src/features/` and is under 40 lines. No `fetch`, no `useState` for server data, no inline styles.
2. **All logic lives in `src/features/[feature]/`.** Each feature is self-contained: `api/`, `hooks/`, `components/`, `screens/`, `store/`, `types/`.
3. **Shared infra lives in `src/core/`.** Design tokens (`theme/`), generic hooks (`hooks/`), UI atoms (`components/`), global stores (`store/`), api client, utils.
4. **Server data → TanStack Query. UI state → Zustand.** Never `useState` + `useEffect` + `fetch`. Never cache server data in Zustand.
5. **Design tokens only.** Never hardcode colors, spacing, or radii. Import from `@/src/core/theme`.

---

## Project Architecture

```
src/
├── core/                    # Shared infrastructure
│   ├── api/                 # client.ts (Axios+JWT), socket.ts, media.ts, mocks/
│   ├── components/          # AppToast, Avatar, SearchBar, ConfirmDialog, EmptyState, DatePicker
│   ├── hooks/               # useDebounce, useNavigation, useConfirmDialog
│   ├── i18n/                # es.ts
│   ├── lib/                 # query-client.ts, secure-store.ts
│   ├── store/               # toast.store.ts, user.store.ts, auth.store.ts
│   ├── theme/               # Colors, Spacing, Radii, Typography, Shadows
│   ├── types/               # user.types.ts, post.types.ts, auth.types.ts, game.types.ts
│   └── utils/               # string.ts (normalizeText)
│
├── features/                # Self-contained feature modules
│   ├── auth/                # api/, components/, hooks/, screens/, types/
│   ├── chat/                # api/, components/{chat-info,chat-room,common,conversation-list}/, hooks/, screens/, store/, types/
│   ├── explore/             # components/, utils/
│   ├── feed/                # components/, hooks/, store/
│   ├── game/                # api/, components/, hooks/, types/
│   ├── notifications/       # api/, components/, hooks/, types/
│   ├── post/                # api/, components/, hooks/, types/
│   └── profile/             # api/, components/, hooks/, types/
│
└── mocks/                   # mock-user.ts, mock-posts.ts, mock-games.ts, etc.
```

---

## Naming Conventions

| What | Convention | Example |
|---|---|---|
| Feature folders | kebab-case | `notifications`, `favorite-games` |
| Components (inside features/) | PascalCase | `PostCard.tsx`, `NotificationsScreen.tsx` |
| Hooks | camelCase, `use` prefix | `useAutocomplete.ts`, `useSessionCheck.ts` |
| API files | kebab-case, `.api` suffix | `auth.api.ts`, `post.api.ts` |
| Types files | kebab-case, `.types` suffix | `chat.types.ts`, `notifications.types.ts` |
| Store files | kebab-case, `.store` suffix | `auth.store.ts`, `toast.store.ts` |
| Lib/config files | kebab-case | `query-client.ts`, `secure-store.ts` |
| Variables/functions | camelCase | `accessToken`, `fetchGameProfiles` |
| Types/interfaces | PascalCase | `Post`, `UserProfile` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE` |

---

## Import Patterns

All imports use the `@/` path alias (root of project):

```ts
import { apiClient } from '@/src/core/api/client'
import { Colors, Spacing } from '@/src/core/theme'
import { useToastStore } from '@/src/core/store/toast.store'
import { useLikePost } from '@/src/features/post/hooks/useLikePost'
import NotificationsScreen from '@/src/features/notifications/components/NotificationsScreen'
```

---

## Thin Wrapper Pattern (app/)

Every route in `app/` follows this exact pattern — import a screen, return it:

```tsx
// app/(tabs)/notifications.tsx
import NotificationsScreen from '@/src/features/notifications/components/NotificationsScreen'

export default function NotificationsRoute() {
  return <NotificationsScreen />
}
```

With props when needed:

```tsx
// app/(tabs)/profile.tsx
import ProfileView from '@/src/features/profile/components/ProfileView'
import { useMockUser } from '@/src/features/profile/hooks/useCurrentUser'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function ProfileScreen() {
  const { push, back } = useNavigation()
  const user = useMockUser()
  return <ProfileView user={user} isSelf={true} push={push} back={back} />
}
```

---

## Feature Folder Structure

Every new feature must follow this internal structure:

```
src/features/[feature]/
├── api/           # {feature}.api.ts — async fetch functions, no hooks, no state
├── components/    # PascalCase components specific to this feature
├── hooks/         # useQuery / useMutation for this feature
├── screens/       # Screen components exported to app/
├── store/         # Zustand store (only UI state, not server data)
└── types/         # {feature}.types.ts
```

---

## TanStack Query Convention

### API layer — pure async functions

```ts
// src/features/post/api/post.api.ts
export const toggleLike = async (postId: string): Promise<LikeResponse> => {
  const { data } = await apiClient.post('/posts/like', { postId })
  return data
}
```

### Hook layer — useQuery / useMutation

```ts
// src/features/post/hooks/useLikePost.ts
export const useLikePost = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: (postId: string) => toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel queries, snapshot previous data
      await queryClient.cancelQueries({ queryKey: FEED_KEY })
      // Optimistic update via setQueryData
    },
    onError: (error, _, context) => {
      // Rollback on error, show toast
      if (context?.previousFeed) queryClient.setQueryData(FEED_KEY, context.previousFeed)
      showToast(error.response?.data?.message || 'Error', 'error')
    },
    onSuccess: (data, postId) => {
      // Sync with server response via setQueryData
      queryClient.setQueryData(postKeys.details(postId), ...)
    },
  })
}
```

### Rules
- `staleTime` minimum 30s for slow-changing data (notifications, profiles).
- Use `onMutate` for optimistic updates on user actions.
- Use `queryClient.setQueryData` for local cache updates without refetching.
- Export `queryKeys` from `api/queryKeys.ts`:
  ```ts
  export const postKeys = {
    all: ['posts'] as const,
    details: (id: string) => ['posts', id] as const,
  }
  ```

---

## Design Tokens

Always import from `@/src/core/theme`. Never hardcode values:

```ts
import { Colors, Spacing, Radii, Typography, Shadows } from '@/src/core/theme'

// ✅ Correct
<View style={{ padding: Spacing.lg, backgroundColor: Colors.primary }}>
  <Text style={{ fontSize: Typography.sizes.xl, color: Colors.text.primary }}>Title</Text>
</View>

// ❌ Wrong
<View style={{ padding: 16, backgroundColor: '#033563' }}>
  <Text style={{ fontSize: 18, color: '#1a1a1a' }}>Title</Text>
</View>
```

---

## Zustand Stores

Only for UI state (not server data). Two types:

### Global (in `src/core/store/`)
```ts
// src/core/store/toast.store.ts
export const useToastStore = create<ToastState>((set) => ({
  message: '', variant: 'success', visible: false,
  showToast: (message, variant = 'success') => set({ message, variant, visible: true }),
  hideToast: () => set({ visible: false }),
}))
```

### Feature-specific (in `src/features/[feature]/store/`)
```ts
// src/features/feed/store/post.store.ts — local UI state for feed
// src/features/chat/store/chat.store.ts — active conversation state, drafts
```

---

## before creating any file

1. Search for existing similar code in `src/core/components/`, `src/core/hooks/`, `src/features/`.
2. Determine correct location:
   - Shared across features? → `src/core/`
   - Specific to one domain? → `src/features/[feature]/`
3. Follow naming: PascalCase for components, camelCase for hooks, `.api.ts` / `.types.ts` / `.store.ts` suffixes.
4. No logic in `app/`. Thin wrapper only.

---

## Commands

| Command | Purpose |
|---|---|
| `npm run start` | Expo dev server |
| `npm run lint` | ESLint (Expo config) |
| `npx tsc --noEmit` | TypeScript check |
| `npm run android` | Run on Android emulator/device |

Always run `npm run lint` and `npx tsc --noEmit` after making changes.

---

## Common Errors

| Error | Likely Cause | Fix |
|---|---|---|
| `Module has no exported member` | Import from stale stub file | Migrate content or add re-export from `features/` |
| `Cannot find module` | Wrong path or deleted file | Verify path with `@/src/features/...` |
| `Object literal may only specify known properties` | Prop not in type | Check type definition in `*.types.ts` |
| `'e' is of type 'unknown'` | Un-typed catch block | Use `instanceof` or `as Error` |

---

## Git Conventions

Conventional Commits: `<type>(<scope>): <description>`

| Type | When |
|---|---|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `refactor` | Code change, no feature/bug |
| `style` | Formatting, naming |
| `chore` | Dependencies, config |
| `docs` | Documentation |

Branch naming: `feature/[name]`, `fix/[name]`, `hotfix/[name]` — kebab-case. Never push directly to `main` or `develop`. PR required.

---

For full conventions see [CONVENTIONS.md](./CONVENTIONS.md).
