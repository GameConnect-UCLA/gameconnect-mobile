# Backend Gaps — Endpoints Faltantes

**Date**: 2026-07-05
**Context**: Endpoints que existen en backend pero frontend NO consume + endpoints que faltan en backend para soportar UI existente.

---

## Endpoints EXISTENTES — Frontend No Usa

Estos endpoints ya están implementados en NestJS. Solo necesitan hooks y conexión en el frontend.

| # | Endpoint | Backend Archivo | Prioridad | UI Actual |
|---|----------|----------------|-----------|-----------|
| 1 | `POST /logout` | `auth.controller.ts:36` | 🔴 Crítica | No implementado |
| 2 | `POST /posts/like` | `posts.controller.ts:28` | 🔴 Crítica | Mock/Missing |
| 3 | `GET /posts/:id/comments` | `posts.controller.ts:64` | 🔴 Crítica | MockComments |
| 4 | `POST /posts/:id/comment` | `posts.controller.ts:36` | 🔴 Crítica | No implementado |
| 5 | `POST /posts/:id/bookmark` | `posts.controller.ts:45` | 🔴 Crítica | No implementado |
| 6 | `GET /posts/bookmarks` | `posts.controller.ts:76` | 🔴 Crítica | post.store local |
| 7 | `DELETE /posts/:id` | `posts.controller.ts:104` | 🟡 Media | No implementado |
| 8 | `PATCH /posts/:id` | `posts.controller.ts:54` | 🟡 Media | No implementado |

---

## Endpoints FALTANTES en Backend

Estos endpoints NO existen en NestJS y serían necesarios para features del frontend que muestran UI pero usan datos mock o no funcionales.

### Auth Module

| # | Endpoint Sugerido | Justificación | UI Existente | Prioridad |
|---|-------------------|---------------|--------------|-----------|
| 1 | `POST /forgot-password` | Flujo de recuperación de contraseña | `ForgotScreen.tsx` | 🟡 Media |
| 2 | `POST /reset-password` | Reset con token desde email | `RecoveryScreen.tsx` | 🟡 Media |

### Users Module

| # | Endpoint Sugerido | Justificación | UI Existente | Prioridad |
|---|-------------------|---------------|--------------|-----------|
| 3 | `POST /users/:id/follow` | Seguir/dejar de seguir usuarios | UserProfileScreen (botón follow) | 🔴 Crítica |
| 4 | `GET /users/:id/followers` | Lista de seguidores | UserProfileScreen (contador mock) | 🟡 Media |
| 5 | `GET /users/:id/following` | Lista de seguidos | UserProfileScreen (contador mock) | 🟡 Media |
| 6 | `GET /users/search?q=` | Búsqueda de usuarios | FeedHeader + NewConversationModal | 🟡 Media |

### Games Module

| # | Endpoint Sugerido | Justificación | UI Existente | Prioridad |
|---|-------------------|---------------|--------------|-----------|
| 7 | `GET /games/search?q=` | Autocomplete en create post | CreatePostScreen (mockGameProfiles) | 🟡 Media |
| 8 | `GET /games` | Lista completa de juegos | ExploreScreen | 🟠 Baja |
| 9 | `GET /games/:id` | Detalle de juego | GameProfileView | 🟠 Baja |

### Chat Module

| # | Endpoint Sugerido | Justificación | UI Existente | Prioridad |
|---|-------------------|---------------|--------------|-----------|
| 10 | `GET /chat/search?q=` | Búsqueda en chat | ChatListScreen (comentado) | 🟠 Baja |
| 11 | `GET /chat/active-users` | Usuarios activos | ChatListScreen, ChatInfoScreen | 🟠 Baja |

### Posts Module

| # | Endpoint Sugerido | Justificación | UI Existente | Prioridad |
|---|-------------------|---------------|--------------|-----------|
| 12 | `GET /posts/:id/likes` | Lista de usuarios que dieron like | PostCard (click en contador) | 🟠 Baja |

---

## Resumen

| Categoría | Cantidad |
|-----------|----------|
| Endpoints existentes sin usar | 8 |
| Endpoints faltantes sugeridos | 12 |
| **Total gaps** | **20** |

### Priorización para Backend (Futuros Sprints)

**Sprint 1 — Críticos**:
1. `POST /users/:id/follow` — Core social feature
2. `POST /forgot-password` + `POST /reset-password` — UX básico
3. `GET /games/search?q=` — CreatePostScreen necesita esto

**Sprint 2 — Medios**:
4. `GET /users/:id/followers` + `GET /users/:id/following`
5. `GET /users/search?q=`
6. `GET /games` + `GET /games/:id`

**Sprint 3 — Bajos**:
7. `GET /chat/search?q=`
8. `GET /chat/active-users`
9. `GET /posts/:id/likes`
