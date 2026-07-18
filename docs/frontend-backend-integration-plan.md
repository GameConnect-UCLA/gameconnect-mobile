# Frontend-Backend Integration Plan

**Date**: 2026-07-05
**Scope**: Conectar frontend mobile a endpoints backend existentes + eliminar mocking

---

## Overview

**Total endpoints backend**: 22 (Auth, Feed, Posts, Users, Media)
**Total pantallas frontend**: 22 (5 tabs + detail screens + chat)
**Gap principal**: ~70% de endpoints existen pero frontend no los consume

---

## Estrategia de Invalidation

### Query Keys Pattern
```ts
// Centralizado en src/features/post/api/queryKeys.ts
postKeys = {
  all: ['posts'],
  feed: (params) => [...postKeys.all, 'feed', params],
  comments: (postId) => [...postKeys.all, 'comments', postId],
  bookmarks: (params) => [...postKeys.all, 'bookmarks', params],
  details: (id) => [...postKeys.all, id],
}
```

### Reglas de Invalidation
| Acción | Qué Invalidar | Optimistic |
|--------|---------------|------------|
| Like/unlike post | `postKeys.details(postId)` | Sí, toggle local |
| Create comment | `postKeys.comments(postId)` | Sí, append local |
| Delete/update post | `postKeys.feed()`, `postKeys.details(id)` | No (reload) |
| Bookmark/unbookmark | `postKeys.bookmarks()`, `postKeys.details(id)` | Sí, toggle local |
| Logout | Todo queryClient | No |

---

## Error Handling

- **Fuente**: `error.response.data.message` del backend directamente
- **Fallback**: Mensaje genérico descriptivo
- **Display**: `useToastStore.showToast(msg, 'error')`
- **Lugar**: En el hook (onError), no en el componente

---

## Empty States / Coming Soon

- **Componente reutilizable**: `<EmptyState title={...} description={...} />`
- **Coming soon**: Toast info al presionar feature no disponible
- **Mock files**: No se deletean. Solo se remueven imports/usos.

---

## Fase 1: Documentación & Setup

### 1.1 `docs/backend-gaps.md`
Listar endpoints que:
- ✅ Existen en backend → conectar en frontend
- ❌ Faltan en backend → documentar para futuros sprints
- 📋 Priorizar por criticidad

### 1.2 `src/features/post/api/queryKeys.ts`
Centralizar todas las query keys del módulo posts.

### 1.3 `src/core/components/EmptyState.tsx`
Componente reutilizable para estados vacíos.

---

## Fase 2: Hooks Críticos (8 nuevos)

### Patrón Estándar
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/src/core/store/toast.store'

export const useLikePost = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore(s => s.showToast)

  return useMutation({
    mutationFn: (postId: string) => postApi.likePost(postId),
    onMutate: async (postId) => { /* optimistic update */ },
    onError: (error, ...) => {
      const msg = error.response?.data?.message || 'Error al dar like'
      showToast(msg, 'error')
      // rollback
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.feed() })
    },
  })
}
```

### Lista de Hooks

| # | Hook | Endpoint | Tipo |
|---|------|----------|------|
| 1 | `useLikePost` | POST /posts/like | Mutation + optimistic |
| 2 | `usePostComments` | GET /posts/:id/comments | Query |
| 3 | `useCreateComment` | POST /posts/:id/comment | Mutation + optimistic |
| 4 | `useBookmarkPost` | POST /posts/:id/bookmark | Mutation + optimistic |
| 5 | `useFetchBookmarks` | GET /posts/bookmarks | Infinite Query |
| 6 | `useDeletePost` | DELETE /posts/:id | Mutation |
| 7 | `useUpdatePost` | PATCH /posts/:id | Mutation |
| 8 | `useLogout` | POST /logout | Mutation + cleanup |

---

## Fase 3: API Functions

### `src/features/post/api/posts.api.ts` (agregar)
```ts
export const likePostApi = (postId) => client.post('/posts/like', { postId })
export const getPostCommentsApi = (postId, params) => client.get(`/posts/${postId}/comments`, { params })
export const createCommentApi = (postId, body) => client.post(`/posts/${postId}/comment`, body)
export const bookmarkPostApi = (postId) => client.post(`/posts/${postId}/bookmark`)
export const getBookmarkedPostsApi = (params) => client.get('/posts/bookmarks', { params })
export const deletePostApi = (postId) => client.delete(`/posts/${postId}`)
export const updatePostApi = (postId, body) => client.patch(`/posts/${postId}`, body)
```

### `src/features/auth/api/auth.api.ts` (agregar)
```ts
export const logoutApi = (refreshToken) => client.post('/logout', { refreshToken })
```

---

## Fase 4: Componentes Reutilizables

### `src/core/components/EmptyState.tsx`
```tsx
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onPress: () => void }
}
```

Usado en: FavoritesScreen, PostDetailScreen, GameProfileView, ChatListScreen

---

## Fase 5: Conectar UI

| Componente | Hook(s) a conectar | Cambio |
|-----------|-------------------|--------|
| **PostCard** | `useLikePost` | Botón like funcional + contador |
| **PostDetailView** | `usePostComments` + `useCreateComment` + `useDeletePost` + `useUpdatePost` | Comments reales, delete/edit funcional |
| **FavoritesScreen** | `useFetchBookmarks` | Reemplazar post.store local |
| **ProfileView** | `useLogout` | Botón logout, cleanup, redirect login |
| **CreatePostScreen** | (sin cambios hooks) | Remover `mockGameProfiles` fallback |

---

## Fase 6: Eliminar Mocking

**No se deletean archivos mock**. Solo se remueven imports/usos.

| Ubicación | Mock a remover | Reemplazo |
|-----------|---------------|-----------|
| `CreatePostScreen` | `mockGameProfiles` | Toast "Coming soon" |
| `ChatListScreen` | `ACTIVE_USERS` | EmptyState |
| `ChatInfoScreen` | `ACTIVE_USERS` | EmptyState |
| `NewConversationModal` | `ACTIVE_USERS` | EmptyState |
| `GameProfileView` | `mockPosts` | EmptyState |
| `useGameProfiles` | `return mockFavoriteGames` | `return []` |
| `post.store.ts` | Comentario `mockPosts` | Limpiar |

---

## Orden de Implementación

1. **Docs** — escribir plan + backend gaps
2. **Setup** — queryKeys, EmptyState component
3. **API functions** — posts.api.ts, auth.api.ts
4. **Hooks** — useLikePost, usePostComments, useCreateComment, useBookmarkPost, useFetchBookmarks, useDeletePost, useUpdatePost, useLogout
5. **Conectar** — PostCard, PostDetailView, FavoritesScreen, ProfileView
6. **Mock cleanup** — remover todos los imports mock

---

## Archivos Afectados

**Crear (13):**
- `docs/frontend-backend-integration-plan.md`
- `docs/backend-gaps.md`
- `src/features/post/api/queryKeys.ts`
- `src/features/post/hooks/useLikePost.ts`
- `src/features/post/hooks/usePostComments.ts`
- `src/features/post/hooks/useCreateComment.ts`
- `src/features/post/hooks/useBookmarkPost.ts`
- `src/features/post/hooks/useFetchBookmarks.ts`
- `src/features/post/hooks/useDeletePost.ts`
- `src/features/post/hooks/useUpdatePost.ts`
- `src/features/auth/hooks/useLogout.ts`
- `src/core/components/EmptyState.tsx`

**Editar (12):**
- `src/features/post/api/posts.api.ts`
- `src/features/auth/api/auth.api.ts`
- `src/features/feed/components/PostCard.tsx`
- `src/features/post/components/PostDetailView.tsx`
- `src/features/feed/components/FavoritesScreen.tsx`
- `src/features/profile/screens/ProfileView.tsx`
- `src/features/post/components/CreatePostScreen.tsx`
- `src/features/chat/screens/ChatListScreen.tsx`
- `src/features/chat/screens/ChatInfoScreen.tsx`
- `src/features/chat/components/conversation-list/NewConversationModal.tsx`
- `src/features/game/components/GameProfileView.tsx`
- `src/features/game/hooks/useGameProfiles.ts`
- `src/features/feed/store/post.store.ts`
