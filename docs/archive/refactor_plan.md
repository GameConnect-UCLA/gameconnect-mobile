# Plan de Refactor — GameConnect Mobile

> **Versión:** 1.1  
> **Stack:** React Native 0.81 + Expo SDK 54 + Expo Router v6 + Zustand + TanStack Query v5 + TypeScript estricto  
> **Archivos fuente:** ~113 (`src/`) + ~30 (`app/`)  
> **Audiencia:** Todo el equipo de desarrollo

---

## 1. Resumen Ejecutivo

**Estado actual:** El proyecto está organizado por capa técnica (`api/`, `components/`, `hooks/`, `store/`, `types/`). Esto fuerza a saltar entre 4-5 directorios para entender una sola feature. Los archivos de ruta en `app/` acumulan lógica de negocio (ej. `app/chat/[id]/index.tsx` con 452 líneas, `app/chat/[id]/info.tsx` con 868 líneas). Hay dos sistemas de estilos paralelos sin tokens compartidos, valores hardcodeados repetidos en decenas de archivos, componentes duplicados (`PostItem` vs `PostCard`), y un subsistema de chat con audio/video/documento que se va a eliminar. El hook de notificaciones usa `useState`+`useEffect` en lugar de TanStack Query. No existe i18n y la UI mezcla español e inglés.

**Objetivo:** Migrar a una arquitectura feature-based (`src/features/[feature]/`), centralizar design tokens, eliminar subsistemas muertos, corregir 7 bugs UX identificados, unificar componentes duplicados, y estandarizar nomenclatura. Todo sin romper la funcionalidad existente.

**Impacto esperado:** Reducción de ~30% en el tiempo de onboarding de nuevos desarrolladores. Eliminación de ~15 archivos. Reducción de `chat-input.tsx` de 509 → ~150 líneas. Centralización de ~35 calls a `Alert.alert` en un sistema toast/dialog unificado. Consistencia visual completa vía design tokens.

**Riesgos:** La migración a feature folders requiere actualizar ~300 imports. El reemplazo de `Alert.alert` por diálogo global puede cambiar flujo en modales de confirmación. La eliminación de audio/video/documento del chat requiere verificar que ningún flujo externo dependa de esos tipos. Se recomienda usar estructura paralela durante la migración (viejo y nuevo coexistiendo) y eliminar lo viejo solo cuando todas las referencias estén migradas.

---

## 2. Inventario de Deuda Técnica

| # | Issue | Severidad | Archivos Afectados | Esfuerzo Est. |
|---|-------|-----------|-------------------|---------------|
| 1 | Sin design tokens — colores hardcodeados repetidos | ALTA | ~40+ archivos | 6h |
| 2 | `Alert.alert()` nativo en 35+ lugares (11 archivos) | ALTA | `chat-input.tsx`, `ChatOverflowMenu.tsx`, `settings.tsx`, `change-password-view.tsx`, `newgroup.tsx`, `chat/index.tsx`, `chat/[id]/info.tsx`, `chat/[id]/index.tsx` | 4h |
| 3 | `app/chat/[id]/info.tsx` = 868 líneas con lógica + modals inline | ALTA | `app/chat/[id]/info.tsx` | 4h |
| 4 | `app/chat/[id]/index.tsx` = 452 líneas con search, reply, delete | ALTA | `app/chat/[id]/index.tsx` | 3h |
| 5 | `chat-input.tsx` = 509 líneas con audio/video/documento/game/mentions | ALTA | `chat-input.tsx` | 3h |
| 6 | UI mezcla español/ingles sin i18n | MEDIA | ~20 archivos de UI | 3h |
| 7 | `PostItem` / `PostCard` duplicados | MEDIA | `post-item.tsx`, `post-card.tsx`, `user-profile.tsx` | 2h |
| 8 | `useNotifications` usa `useState`+`useEffect` en vez de TanStack Query | MEDIA | `useNotifications.ts`, `notifications.ts` | 1.5h |
| 9 | Chat types incluyen `AttachmentType.AUDIO/VIDEO/DOCUMENT` a eliminar | MEDIA | `chat.types.ts`, `chat-input.tsx`, `media-preview.tsx`, `media-preview-modal.tsx`, 3 archivos `bubble/` | 2h |
| 10 | `DateOfBirthInput.tsx` usa TextInput con regex manual | BAJA | `DateOfBirthInput.tsx` | 1.5h |
| 11 | Navegación post-login no invalida stack auth | BAJA | `app/(auth)/_layout.tsx`, `app/(tabs)/_layout.tsx` | 0.5h |
| 12 | Hashtags en PostCard no son navegables | BAJA | `post-card.tsx`, `app/explore.tsx` | 1h |
| 13 | `FavoriteGamesView` sin SearchBar | BAJA | `favorite-games.tsx` | 0.5h |
| 14 | `chat.store.ts` tiene `activeReplyMessage` y `activeMenuMessage` sin uso | BAJA | `chat.store.ts` | 0.25h |
| 15 | Mocks viven dentro de `hooks/` en vez de `mocks/` | BAJA | 9 archivos en `hooks/mock-data/` | 1h |
| 16 | `socket.io-client` instalado, cero imports | BAJA | `package.json` | 0.1h |
| 17 | Mock ID mismatch — `ACTIVE_USERS.id "1"` ≠ `CONVERSATIONS.members.user_id "user1"` | BAJA | `mock-chat.ts` | 0.25h |
| 18 | `game.api.ts` existe pero es mínima, perfil de juego sin TanStack Query | BAJA | `game.api.ts`, `useMockGameProfile.ts` | 1h |

---

## 3. Nueva Arquitectura

### Árbol de Carpetas Completo

```
src/
├── core/                              # Capa base — sin dependencia de features
│   ├── theme/
│   │   └── index.ts                   # Colors, Spacing, Radii, Typography, Shadows
│   ├── components/                    # Componentes verdaderamente globales
│   │   ├── Button.tsx
│   │   ├── Avatar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── AppToast.tsx               # Migrado desde src/components/ui/app-toast.tsx
│   │   ├── ConfirmDialog.tsx          # NUEVO — Modal global para confirmaciones
│   │   └── DatePicker.tsx             # NUEVO — @react-native-community/datetimepicker wrapper
│   ├── hooks/
│   │   ├── useDebounce.ts             # Migrado desde src/hooks/useDebounce.ts
│   │   └── useConfirmDialog.ts        # NUEVO — hook para abrir ConfirmDialog
│   ├── lib/
│   │   ├── secure-store.ts            # Migrado desde src/lib/secure-store.ts
│   │   └── query-client.ts            # NUEVO — configuración centralizada de TanStack Query
│   ├── store/
│   │   ├── auth.store.ts              # Migrado desde src/store/auth.store.ts
│   │   ├── user.store.ts              # Migrado desde src/store/user.store.ts
│   │   └── toast.store.ts             # Migrado + extendido con variantes warning/info
│   ├── types/
│   │   ├── index.ts                   # Re-exports
│   │   ├── auth.types.ts              # Migrado desde src/types/auth.types.ts
│   │   ├── user.types.ts              # Migrado desde src/types/user.types.ts
│   │   ├── post.types.ts              # Migrado desde src/types/post.types.ts
│   │   └── game.types.ts              # Migrado desde src/types/game.types.ts
│   └── i18n/
│       └── es.ts                      # NUEVO — todas las strings de UI en español
│
├── features/                          # Feature modules — cada uno autocontenido
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.api.ts
│   │   ├── components/
│   │   │   ├── AuthCard.tsx
│   │   │   ├── AuthBackground.tsx
│   │   │   └── DateOfBirthPicker.tsx  # NUEVO — envuelve DatePicker de core
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useSignup.ts
│   │   │   ├── useSessionCheck.ts
│   │   │   └── useLogout.ts
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx        # Extraído de app/(auth)/login.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   ├── ForgotScreen.tsx
│   │   │   └── RecoveryScreen.tsx
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── feed/
│   │   ├── components/
│   │   │   ├── Feed.tsx
│   │   │   ├── PostCard.tsx           # UNIFICADO — reemplaza PostItem + viejo PostCard
│   │   │   ├── PostActions.tsx
│   │   │   └── PostMedia.tsx
│   │   ├── hooks/
│   │   │   └── useFeed.ts
│   │   └── store/
│   │       └── post.store.ts          # Migrado desde src/store/post.store.ts
│   │
│   ├── post/
│   │   ├── api/
│   │   │   └── post.api.ts            #placeholder para backend real
│   │   ├── components/
│   │   │   ├── PostDetailView.tsx
│   │   │   ├── PostComments.tsx
│   │   │   └── CreatePostScreen.tsx
│   │   ├── hooks/
│   │   │   └── useCreatePost.ts
│   │   └── types/
│   │       └── post.types.ts
│   │
│   ├── chat/                          # MVP — solo texto, imágenes, game cards
│   │   ├── api/
│   │   │   └── chat.api.ts            # Migrado + limpiado (sin audio/video/doc)
│   │   features/
          chat/
│   │     ├── components/
│   │     ├── common/                    # Componentes reutilizables entre screens
│   │     ├── ChatInput.tsx
│   │     ├── MessageBubble.tsx
│   │     ├── ImageAttachment.tsx
│   │     ├── ReplyPreview.tsx
│   │     ├── ReplyBar.tsx
│   │     ├── AutocompleteDropdown.tsx    # Genérico — unifica menciones + game suggestions
│   │     ├── ScrollToBottomButton.tsx
│   │     ├── GameInfoCard.tsx
│   │     └── ChatOverflowMenu.tsx
│   │     │
│   │     ├── conversation-list/         # Screen: lista de conversaciones
│   │     ├── ConversationList.tsx
│   │     ├── ConversationRow.tsx
│   │     ├── NewConversationModal.tsx
│   │     └── ChatSearchBar.tsx
│   │
│   │     ├── chat-room/                 # Screen: chat individual
│   │     ├── ChatHeader.tsx
│   │     ├── ChatMediaGrid.tsx
│   │     ├── ChatLinkList.tsx
│   │     └── MessageActionSheet.tsx
│   │
│   │     ├── chat-info/                 # Screen: info del chat/grupo
│   │     ├── ContactInfoCard.tsx
│   │     ├── GroupMemberRow.tsx
│   │     ├── GroupRoleBadge.tsx
│   │     └── ConversationActionsSheet.tsx
│   │
│   │     │── new-group/                 # Screen: crear grupo
│         └── NewGroupScreen.tsx     # o NewGroupForm.tsx si prefieres
│
│   │   ├── hooks/
│   │   │   ├── useConversation.ts        # Consolidado — query + send/delete optimistic mutations
│   │   │   ├── useChatList.ts            # Consolidado — agrupa useConversations + useChatSearch
│   │   │   ├── useChatInput.ts           # NUEVO — extraído de chat-input.tsx (menciones, game card, attachments)
│   │   │   ├── useAutocomplete.ts        # NUEVO — lógica genérica de @mención / búsqueda de juegos
│   │   │   ├── useScrollToBottom.ts
│   │   │   └── useGroupMembers.ts
│   │   ├── store/
│   │   │   └── chat.store.ts          # Sin activeReplyMessage/activeMenuMessage. Maneja reply, menciones, attachments state
│   │   └── types/
│   │       └── chat.types.ts          # Sin AUDIO/VIDEO/DOCUMENT, con Message.status
│   │
│   ├── game/
│   │   ├── api/
│   │   │   └── game.api.ts            # Migrado + TanStack Query
│   │   ├── components/
│   │   │   ├── GameProfileView.tsx
│   │   │   ├── GameEditProfileView.tsx
│   │   │   ├── GameSearchModal.tsx
│   │   │   └── GameInfoCardDisplay.tsx
│   │   ├── hooks/
│   │   │   └── useGameProfiles.ts     # Renombrado desde useMockGameProfile
│   │   └── types/
│   │       └── game.types.ts
│   │
│   ├── profile/
│   │   ├── components/
│   │   │   ├── ProfileView.tsx
│   │   │   ├── EditProfileView.tsx
│   │   │   ├── FavoriteGamesView.tsx  # Con SearchBar + useMemo filter
│   │   │   ├── SettingsView.tsx
│   │   │   └── ChangePasswordView.tsx
│   │   └── hooks/
│   │       └── useCurrentUser.ts      # Renombrado desde useMockUser
│   │
│   ├── explore/
│   │   ├── components/
│   │   │   ├── ExploreScreen.tsx      # Extraído de app/explore.tsx
│   │   │   ├── ExploreStickyHeader.tsx
│   │   │   ├── ExploreSectionCard.tsx
│   │   │   └── ExplorePlayersGrid.tsx
│   │   ├── hooks/
│   │   │   └── useExplore.ts          # Extraído de app/explore.tsx
│   │   └── utils/
│   │       └── explore.utils.ts       # Migrado + normalizeText pasa a core/
│   │
│   └── notifications/
│       ├── api/
│       │   └── notifications.api.ts   # Migrado desde api/notifications.ts
│       ├── components/
│       │   ├── NotificationsScreen.tsx# Extraído de app/(tabs)/notifications.tsx
│       │   ├── NotificationItem.tsx
│       │   ├── FollowRequestsCard.tsx
│       │   └── SectionHeader.tsx
│       ├── hooks/
│       │   └── useNotifications.ts    # MIGRADO a TanStack Query
│       └── types/
│           └── notifications.types.ts # Extraído de notificationsMock.ts
│
└── mocks/                             # TODOS los mocks consolidados
    ├── mock-chat.ts
    ├── mock-game.ts
    ├── mock-posts.ts
    ├── mock-user.ts
    └── mock-users-list.ts
```

### Descripción de Capas

| Capa | Propósito | Reglas |
|------|-----------|--------|
| `core/` | Fundación reutilizable sin dependencia de features | No importa nada de `features/`. `core/components/` solo recibe props. `core/store/` solo estado global puro (auth, toast). |
| `features/` | Módulos de negocio autocontenidos | Cada feature tiene su propia carpeta `api/`, `components/`, `hooks/`, `types/`. Solo pueden importar de `core/`, `mocks/`, y otras features vía `core/types/`. |
| `mocks/` | Datos mock para desarrollo | No contiene hooks ni lógica. Solo datos planos exportados. Los hooks importan de aquí. |
| `app/` | Rutas — thin wrappers (<40 líneas) | No contiene lógica de negocio. Importa screens desde `features/`. |

## Nota sobre tipos compartidos

Los archivos en `core/types/` definen el contrato entre frontend y backend.
Al iniciar el backend NestJS, estos tipos se reutilizan directamente como 
interfaces TypeScript. No se crean DTOs separados salvo que sea estrictamente 
necesario (ej: validación con class-validator).

Si el schema de DB usa `snake_case`, el backend expone `camelCase` y transforma 
en el repository layer — el frontend nunca ve `snake_case`.

---

## 4. Features Eliminadas del Chat

### Archivos a Eliminar

| Archivo | Razón |
|---------|-------|
| `src/components/chat/bubble/audio-attachment.tsx` | Audio eliminado del chat |
| `src/components/chat/bubble/video-attachment.tsx` | Video eliminado del chat |
| `src/components/chat/bubble/document-attachment.tsx` | Documentos eliminados del chat |
| `src/components/chat/bubble/full-screen-viewer.tsx` | Soportaba video full-screen, ya no necesario |
| `src/components/chat/media-preview-modal.tsx` | Usado principalmente para video preview con `expo-video` |

### Cambios en Tipos (`chat.types.ts`)

- **`AttachmentType`**: eliminar `VIDEO`, `DOCUMENT`, `AUDIO`. Dejar solo `IMAGE` y `GIF`.
- **`Attachment`**: eliminar campos `duration`, `trim_start`, `trim_end`, `muted`, `file_name`, `file_size`, `mime_type` (específicos de audio/video/doc). Opcionales de IMAGE.
- **`Message`**: agregar campo opcional `status?: 'sending' | 'sent' | 'delivered' | 'read'`
- **`ConversationUI`** y **`GroupMemberUI`**: eliminar (legacy, ya no usados)
- Eliminar tipo `SharedFileItem` (solo documentos compartidos)

### Cambios en `chat-input.tsx`

Eliminar:
- `pickVideo()` y todo el flujo de selección de video
- `pickDocument()` y `expo-document-picker` import
- `hasBlockingAttachments` check (solo aplicaba a audio/documento)
- `MediaPreviewModal` import y su estado `mediaPreview` (ya no se necesita preview modal para video)
- Botón de video y documento en el attachment menu
- Lógica de `AttachmentType.AUDIO`, `.VIDEO`, `.DOCUMENT`

Simplificar:
- `MediaPreview` ya no necesita mostrar iconos para tipos no-imagen
- El attachment menu queda con 2 opciones: imagen y game card
- Target: ~150 líneas

### Cambios en `media-preview.tsx`

- Eliminar `getAttachmentIcon()` (solo image/gif ahora)
- Eliminar `formatFileSize()` (solo aplicaba a documentos)
- Simplificar a solo renderizado de imágenes

### Dependencias a Remover

Ninguna dependencia npm se elimina completamente (`expo-document-picker` podría usarse en otro lado, verificar). `expo-video` se conserva para uso potencial en feed.

---

## 5. Correcciones UX

### 5.1 Input de Fecha Nativo

**Problema:** `DateOfBirthInput.tsx` usa `TextInput` con regex manual para formatear `DD-MM-AAAA`. Frágil, no valida fechas reales (ej. 31-02-2025 pasa), UX pobre en móvil.

**Archivos afectados:** `src/components/signup/DateOfBirthInput.tsx`

**Solución:**
1. Instalar `@react-native-community/datetimepicker` (compatible con Expo)
2. Crear `src/core/components/DatePicker.tsx` que envuelva el datetimepicker con props: `value`, `onChange`, `mode: 'date' | 'time'`, `maximumDate`, `minimumDate`
3. Reemplazar `DateOfBirthInput.tsx` con el nuevo `DatePicker` en `features/auth/components/DateOfBirthPicker.tsx`
4. Usar mismo componente en perfil si aplica

**Dependencias nuevas:** `@react-native-community/datetimepicker`

### 5.2 Alertas → Toast + ConfirmDialog Global

**Problema:** 35+ llamadas a `Alert.alert()` nativo distribuidas en 11 archivos. Ya existe `toast.store.ts` y `AppToast.tsx` para feedback positivo, pero no cubre:
- Variantes `warning` e `info`
- Casos de confirmación (¿Estás seguro?) que requieren acción sí/no

**Archivos afectados (11 archivos, 35+ llamadas):**
- `src/components/chat/chat-input.tsx` (4 Alert.alert)
- `src/components/chat/ChatOverflowMenu.tsx` (2)
- `src/components/user/settings.tsx` (7)
- `src/components/user/change-password-view.tsx` (3)
- `app/chat/newgroup.tsx` (4)
- `app/chat/index.tsx` (3)
- `app/chat/[id]/info.tsx` (10)
- `app/chat/[id]/index.tsx` (1)
- `app/(auth)/login.tsx` usa `alert()` no `Alert.alert` (1)

**Solución:**
1. Extender `toast.store.ts` con variantes `'warning'` y `'info'`
2. Crear `src/core/hooks/useConfirmDialog.ts` que expone `confirm(options): Promise<boolean>`
3. Crear `src/core/components/ConfirmDialog.tsx` — Modal global renderizado en `_layout.tsx`
4. Agregar `ConfirmDialogProvider` en `_layout.tsx` que renderiza el modal y expone contexto
5. Migrar casos de confirmación (block/unblock, leave group, delete, logout) a `useConfirmDialog`
6. Migrar casos de feedback simple a `useToastStore.showToast()`
7. Dejar solo `Alert.alert` para casos críticos del sistema operativo

**Dependencias nuevas:** Ninguna

### 5.3 Navegación Post-Login

**Problema:**
- `app/index.tsx` usa `<Redirect>` pero no limpia el stack de `(auth)`
- `app/(auth)/_layout.tsx` usa `Stack` sin `gestureEnabled: false`
- Si usuario navega back desde tabs, puede regresar al login
- `login.tsx` usa `router.replace("/(tabs)")` que debería ser correcto pero el stack auth sigue montado

**Archivos afectados:** `app/_layout.tsx`, `app/(auth)/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/index.tsx`, `app/(auth)/login.tsx`, `app/(auth)/signup.tsx`

**Solución:**
1. En `app/_layout.tsx` usar `Stack` con `screenOptions` y asegurar que tabs tenga prioridad
2. En `app/(tabs)/_layout.tsx`:
   ```tsx
   <Tabs screenOptions={{ ...navigationOptions: { gestureEnabled: false } }}>
   ```
3. En `app/(auth)/_layout.tsx`: esto ya es correcto, solo asegurar que login/signup usen `router.replace`
4. En `login.tsx` y `signup.tsx` confirmar que el callback de éxito usa `router.replace("/(tabs)")` (ya implementado)
5. El problema real está en que Expo Router mantiene el stack `(auth)` vivo aunque se navegue a `(tabs)`. Solución: en `login.tsx`, después del replace exitoso, el stack `(auth)` debe desmontarse. Con Expo Router v6, `router.replace` debería manejar esto si la navegación es entre grupos. Verificar en runtime.

**Dependencias nuevas:** Ninguna

### 5.4 Hashtags Navegables → Explorar

**Problema:** En `PostCard`, los hashtags (`#RPG`, `#FPS`) son `View` con texto estático. El usuario no puede presionar para explorar contenido relacionado.

**Archivos afectados:** `src/components/posts/post-card.tsx`, `app/explore.tsx`

**Solución:**
1. En `post-card.tsx`, cambiar cada `hashtagPill` de `View` a `TouchableOpacity`
2. Al presionar: `router.push('/explore?q=%23' + tag)`
3. En `app/explore.tsx` (futuro `ExploreScreen`), leer `useLocalSearchParams().q` en mount
4. Si `q` existe y empieza con `#`, pre-poblar `searchQuery` con el valor (sin el `#`)

**Dependencias nuevas:** Ninguna

### 5.5 Búsqueda en Juegos Favoritos

**Problema:** `FavoriteGamesView` muestra todos los juegos sin filtrado. Con 10+ juegos en mock, ya se nota la ausencia.

**Archivos afectados:** `src/components/user/favorite-games.tsx`

**Solución:**
1. Agregar `SearchBar` (importar desde `core/components/SearchBar.tsx`) en el header
2. Mantener estado `searchQuery` local
3. Usar `useMemo` para filtrar `games` por `name` (usando `normalizeText()` que vive en `explore.utils.ts` y debe migrarse a `core/`)
4. Layout: SearchBar entre el header row y el grid

**Dependencias nuevas:** Ninguna

### 5.6 Estandarizar Idioma de la UI

**Problema:** La app mezcla español e inglés en labels, placeholders, errores, tooltips.

**Archivos afectados:** ~20 archivos de UI

Ejemplos concretos verificados en código:
| Ubicación | Texto actual | Debería ser |
|-----------|-------------|-------------|
| `ChatOverflowMenu.tsx:46` | "Clear Chat" | "Limpiar Chat" |
| `chat-input.tsx:163` | "Invalid Message" | "Mensaje Inválido" |
| `chat-input.tsx:191` | "Limit Reached" | "Límite Alcanzado" |
| `message-action-sheet.tsx` | "Reply" / "Delete for Everyone" | "Responder" / "Eliminar para Todos" |
| `chat/index.tsx` | "No chats yet" / "Search above..." | "Sin chats aún" / "Busca arriba..." |
| `newgroup.tsx:56` | "Validation" / "Group name is required." | "Validación" / "El nombre del grupo es obligatorio." |
| `chat-header.tsx` | "last seen recently" / "X members" | "visto recientemente" / "X miembros" |
| `ConversationRow.tsx` | "Yesterday" | "Ayer" |
| `chat/[id]/info.tsx` | "Members" / "Media" / "Archivos" / "Enlaces" | "Miembros" / "Multimedia" / "Archivos" / "Enlaces" |
| `ChatOverflowMenu.tsx` | Todos los items en inglés | Español |
| `GroupRoleBadge.tsx` | "Owner" / "Admin" / "Member" | "Propietario" / "Admin" / "Miembro" |

**Solución:**
1. Crear `src/core/i18n/es.ts` con objeto plano de strings organizado por dominio:
   ```typescript
   export const strings = {
     chat: {
       header: { lastSeen: 'visto recientemente', members: '{count} miembros' },
       input: { placeholder: 'Mensaje...', limitReached: 'Límite Alcanzado' },
       actions: { reply: 'Responder', deleteForEveryone: 'Eliminar para Todos' },
       // ...
     },
     common: { cancel: 'Cancelar', confirm: 'Confirmar', save: 'Guardar' },
     // ...
   }
   ```
2. Reemplazar strings hardcodeadas con referencias a `strings.chat.header.members`
3. No usar librería i18n (overhead innecesario para un solo idioma)

**Dependencias nuevas:** Ninguna

### 5.7 Indicadores de Estado de Mensaje

**Problema:** Los mensajes propios no tienen indicador visual de estado (enviado/visto). El tipo `Message` no incluye campo de estado. Es un feature esperado en cualquier chat.

**Archivos afectados:** `src/types/chat.types.ts`, `src/hooks/chat/useConversation.ts`, `src/components/chat/bubble/chat-message-bubble.tsx`

**Solución:**
1. En `chat.types.ts`, agregar a `Message`:
   ```typescript
   status?: 'sending' | 'sent' | 'delivered' | 'read'
   ```
2. En `useConversation.ts`, en `onMutate`, los mensajes optimistas (`id: 'temp-...'`) arrancan con `status: 'sending'`. Cuando el mutation se resuelve (onSettled), invalidar query y el dato fresco del backend tendrá `status: 'sent'`.
3. En `ChatMessageBubble`, junto al timestamp del mensaje propio, mostrar:
   - `sending`: `<ActivityIndicator size={12} />` o icono reloj
   - `sent`: check simple `✓` gris
   - `delivered`: doble check `✓✓` gris
   - `read`: doble check `✓✓` azul (`#34B7F1`)
4. El mock no implementará `delivered`/`read` reales (no hay socket), pero la UI queda lista para el backend.

**Dependencias nuevas:** Ninguna

### 5.8 Navegación por Stack (Rapid-tap Stacking)

**Problema:** 26 `router.push()` sin protección contra taps rápidos. Presionar 3 veces en 200ms un botón (comentario, perfil, fila de chat, game card, etc.) apila 3 instancias de la misma pantalla. El usuario debe presionar "back" 3+ veces para salir.

**Archivos afectados (15 archivos, 26 ocurrencias):**
- `src/components/posts/post-card.tsx` — post detail y user profile
- `app/chat/index.tsx` — conversation rows, active avatars, new group
- `src/components/user/favorite-games.tsx` — game grid items
- `src/components/post-details/post-comments.tsx` — author profile
- `app/(tabs)/profile.tsx`, `app/user/[id].tsx` — edit, settings, games
- `src/components/games/game-profile.tsx` — settings
- `src/components/chat/new-conversation-modal.tsx`
- `src/components/feed/feed.tsx`, `src/components/ui/feed-header.tsx`
- `app/chat/[id]/index.tsx` — info, mentions, game card
- `src/components/user/post-item.tsx`
- `src/components/user/settings.tsx`
- `src/components/chat/new-conversation-modal.tsx`

**Solución:** Crear `src/core/hooks/useNavigation.ts` global que envuelve `useRouter()` de expo-router con throttle de 500ms:

```typescript
import { useRouter, Href } from 'expo-router';
import { useCallback } from 'react';

let lastNavigate = 0;
const THROTTLE_MS = 500;

export function useNavigation() {
  const router = useRouter();

  const push = useCallback((href: Href) => {
    const now = Date.now();
    if (now - lastNavigate < THROTTLE_MS) return;
    lastNavigate = now;
    router.push(href);
  }, [router]);

  return { push, back: router.back, replace: router.replace };
}
```

Migrar los 26 `import { useRouter } from 'expo-router'` a `import { useNavigation } from '@/src/core/hooks/useNavigation'`. El throttle es por instancia de componente (cada componente tiene su propio ref), lo que permite navegación independiente entre componentes pero previene doble-tap en el mismo botón.

**Dependencias nuevas:** Ninguna

---

## 6. Refactors de Código

### 6.1 Unificación PostCard / PostItem

**Problema:** `PostItem` (176 líneas) y `PostCard` (436 líneas) duplican: header con avatar, like, comentarios, share, bookmark. `PostItem` se usa solo en `ProfileView`.

**Antes:**
```
PostItem (src/components/user/post-item.tsx) → usado en user-profile.tsx
PostCard (src/components/posts/post-card.tsx) → usado en feed, explore
```

**Después:**
```
PostCard (src/features/feed/components/PostCard.tsx)
  → prop: variant?: 'feed' | 'profile'
  → 'profile': layout simplificado, menos padding, sin galería múltiple
  → 'feed': layout completo con galería, hashtags, review stars
```
- `ProfileView` importa `PostCard` con `variant="profile"` en lugar de `PostItem`
- Eliminar `src/components/user/post-item.tsx`

### 6.2 Design Tokens

**Problema:** Valores hardcodeados repetidos en decenas de archivos.

**Antes:**
```typescript
// En 20+ archivos
color: '#033563'
borderRadius: 18
backgroundColor: 'rgba(210,170,120,0.85)'
padding: 16
fontSize: 16
```

**Después:** `src/core/theme/index.ts`
```typescript
export const Colors = {
  primary: '#033563',
  primaryDark: '#0B4B82',
  accent: '#9b1999',
  accentLight: '#8A38F5',
  surface: 'rgba(255,255,255,0.3)',
  surfaceDark: 'rgba(217,217,217,0.85)',
  text: { primary: '#1a1a1a', secondary: '#535353', accent: '#2A53A0' },
  status: { success: '#0E5A2F', error: '#B42318', warning: '#E8C339' },
  border: 'rgba(24,18,10,0.12)',
  heart: '#D11D3B',
  star: '#C48200',
}

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 }

export const Radii = { sm: 8, md: 14, lg: 18, xl: 24, full: 999 }

export const Typography = {
  sizes: { xs: 11, sm: 13, md: 14, lg: 16, xl: 18, xxl: 22 },
  weights: { regular: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800' } as const,
}
```

Los 10 valores más repetidos identificados para migración inmediata:
| Valor | Apariciones | Token |
|-------|-------------|-------|
| `#033563` | ~40+ | `Colors.primary` |
| `#1a1a1a` | ~30+ | `Colors.text.primary` |
| `#0B4B82` | ~20+ | `Colors.primaryDark` |
| `borderRadius: 18` | ~20+ | `Radii.lg` |
| `#9b1999` | ~15+ | `Colors.accent` |
| `fontSize: 16` | ~40+ | `Typography.sizes.lg` |
| `padding: 16` | ~25+ | `Spacing.lg` |
| `rgba(255,255,255,0.3)` | ~15+ | `Colors.surface` |
| `borderRadius: 8` | ~15+ | `Radii.sm` |
| `#d32f2f` | ~10+ | `Colors.status.error` |

### 6.3 Componentes de Ruta como Thin Wrappers

**Antes:**
| Archivo | Líneas | Problema |
|---------|--------|----------|
| `app/chat/[id]/index.tsx` | 452 | Search, reply, delete, scroll, todo inline |
| `app/chat/[id]/info.tsx` | 868 | Modals, tabs, actions, todo inline |
| `app/(tabs)/notifications.tsx` | 234 | Lógica de render condicional, refresh |
| `app/explore.tsx` | 277 | Trend tags, featured players, filtros |

**Después:**
| Archivo en `app/` | Líneas target | Screen en `features/` |
|-------------------|---------------|----------------------|
| `app/chat/[id]/index.tsx` | ~30 | `features/chat/screens/ChatScreen.tsx` |
| `app/chat/[id]/info.tsx` | ~40 | `features/chat/screens/ChatInfoScreen.tsx` |
| `app/(tabs)/notifications.tsx` | ~30 | `features/notifications/components/NotificationsScreen.tsx` |
| `app/explore.tsx` | ~30 | `features/explore/components/ExploreScreen.tsx` |

Patrón del thin wrapper:
```typescript
// app/chat/[id]/index.tsx
import ChatScreen from '@/src/features/chat/screens/ChatScreen';
export default function ChatRoute() { return <ChatScreen />; }
```

### 6.4 ChatInput Simplificado

**Antes:** 509 líneas. Maneja: texto, imagen, video, audio, documento, game card, menciones, reply bar, media preview modal, validación de blocking attachments. Todo en un solo archivo monolítico.

**Después:** ~200 líneas con lógica extraída a 2 hooks + Zustand store.

```typescript
interface ChatInputProps {
  onSend: (text: string | null, attachments?: Attachment[] | null, replyToId?: string | null, gameCard?: GameInfoCard | null) => void;
  onHeightChange?: (height: number) => void;
  recipientName?: string;
  blocked?: boolean;
  groupMembers?: GroupMember[] | null;
}
```

**Hooks extraídos:**
- `useChatInput` — estado local del input (texto, replyToId, gameCard, validación, handleSend)
- `useAutocomplete` — lógica de detección de `@`, filtrado de miembros, búsqueda de juegos, posición del dropdown

**Zustand (`chat.store.ts`):** attachments (imágenes seleccionadas), replyMessage, mención activa

Attachment menu: 2 botones (imagen, game card). Sin `pickVideo()`, `pickDocument()`, `hasBlockingAttachments`, `MediaPreviewModal`, lógica de audio/video/doc en `handleSend`.

### 6.5 MockData Consolidado

**Antes:** 9 archivos dentro de `src/hooks/mock-data/`:

```
src/hooks/mock-data/
├── mock-chat.ts
├── mock-game-profile.ts
├── mock-game.tsx
├── mock-posts.ts
├── mock-user.tsx
├── mock-users-list.ts
├── useMockGameProfile.ts    ← HOOK dentro de mocks
├── useMockUser.ts           ← HOOK dentro de mocks
└── notificaciones/
    └── notificationsMock.ts
```

**Después:**
```
src/mocks/
├── mock-chat.ts
├── mock-game.ts
├── mock-posts.ts
├── mock-user.ts
└── mock-users-list.ts
```
- Los hooks `useMockGameProfile` y `useMockUser` se migran a `features/game/hooks/useGameProfiles.ts` y `features/profile/hooks/useCurrentUser.ts` respectivamente, consumiendo los mocks desde `src/mocks/`.
- `notificationsMock.ts` se migra a `features/notifications/types/notifications.types.ts` (solo los tipos) y el mock data va a `src/mocks/mock-notifications.ts` (nuevo archivo).

### 6.6 TanStack Query Faltante

**Problema:** `useNotifications.ts` usa `useState`+`useEffect` con fetch manual. No usa TanStack Query para cache, refetch, stale management.

**Antes:**
```typescript
const [notifications, setNotifications] = useState<Notification[]>([]);
const [isLoading, setIsLoading] = useState(true);
useEffect(() => { loadNotifications(); }, [loadNotifications]);
```

**Después:**
```typescript
// src/features/notifications/hooks/useNotifications.ts
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotificationsApi,
    staleTime: 30_000, // 30s
  });
  // mutations for accept/reject
}
```

Esto aplica también a:
- `game.api.ts` → `features/game/hooks/useGameProfiles.ts` debería usar `useQuery` en vez de retornar mock data directamente
- `useMockGameProfile.ts` → convertir a hook TanStack Query

### 6.7 Unused Code

| Item | Archivo | Acción |
|------|---------|--------|
| `socket.io-client` | `package.json` (dependencia) | Remover si no hay plan de usarlo; si hay plan, documentar |
| `activeReplyMessage` | `src/store/chat.store.ts` | Remover del store |
| `activeMenuMessage` | `src/store/chat.store.ts` | Remover del store |
| `ConversationUI` / `GroupMemberUI` | `src/types/chat.types.ts` | Remover (legacy) |
| `favorities/` (typo) | `src/components/favorities/` | Renombrar a `favorites/` o migrar contenido |
| `Mock ID mismatch` | `src/hooks/mock-data/mock-chat.ts` | Alinear `ACTIVE_USERS.id` con `CONVERSATIONS.members.user_id` |

---

## 7. Convenciones Actualizadas

### Nomenclatura Estándar por Capa

| Capa | Patrón | Ejemplo | Notas |
|------|--------|---------|-------|
| Screen component (en `features/`) | PascalCase + `Screen` | `ChatScreen.tsx` | Solo en `features/*/screens/` |
| Route file (en `app/`) | kebab-case | `app/chat/[id]/info.tsx` | Máximo 40 líneas |
| Feature hook | camelCase + `use` + dominio | `useConversation.ts` | Siempre con `use` prefix |
| API function file | kebab-case + `.api` | `chat.api.ts` | Solo funciones, sin hooks |
| Store file | kebab-case + `.store` | `chat.store.ts` | Solo Zustand, sin lógica async |
| Types file | kebab-case + `.types` | `chat.types.ts` | Solo interfaces/types/enums |
| Mock file | `mock-` + dominio | `mock-chat.ts` | Solo datos, sin hooks |
| UI constants | `SCREAMING_SNAKE` en archivo dedicado | `CHAT_CONSTANTS.ts` | Para valores mágicos, límites |
| i18n strings | camelCase en objeto plano | `strings.chatInput.placeholder` | En `core/i18n/es.ts` |
| Test file | `*.test.tsx` o `*.spec.tsx` | `chat-input.test.tsx` | Junto al archivo que prueba |
| Componente UI global | PascalCase | `Button.tsx`, `Avatar.tsx` | En `core/components/` |
| Componente de feature | PascalCase | `PostCard.tsx` | En `features/*/components/` |
| Componente de feature específico de una screen | PascalCase | `ChatHeader.tsx` | En `features/*/components/[screen-name]/` |

### Reglas de Importación

```
core/ ← puede importar solo de core/ y node_modules
features/ ← puede importar de core/, mocks/, y node_modules
mocks/ ← no importa nada del proyecto (solo datos planos)
app/ ← solo importa screens de features/
```

Prohibido:
- `features/a/` importar de `features/b/components/` directamente. Si necesitan compartir tipos, deben vivir en `core/types/`.
- `app/` archivos con más de 40 líneas.
- `core/components/` importar de `features/`.
- `mocks/` contener hooks o lógica de negocio.

---

## 8. Plan de Fases

### Fase 1 — Fundación + Chat Cleanup (no rompe nada existente)
**Esfuerzo:** ~18h
**Checklist:**
- [x] Crear `src/core/theme/index.ts` con todos los tokens
- [x] Crear `src/core/i18n/es.ts` con strings de UI actuales
- [x] Crear `src/mocks/` y mover archivos mock (manteniendo archivos originales como symlinks o imports redirect temporalmente)
- [x] Crear `src/core/lib/query-client.ts` con configuración centralizada de TanStack Query
- [x] Crear estructura de carpetas `features/` vacía (solo las carpetas, sin archivos)
- [x] Refactor `normalizeText()` → mover a `core/utils/string.ts`
- [x] Crear componente genérico `AutocompleteDropdown` en `core/components/` (unifica MentionSuggestions + game search)
- [x] Eliminar `AudioAttachment`, `VideoAttachment`, `DocumentAttachment` (3 archivos)
- [x] Eliminar `FullScreenViewer`
- [x] Simplificar `MediaPreview` (solo imágenes)
- [x] Simplificar `MediaPreviewModal` o eliminar
- [x] Simplificar `ChatInput` → eliminar `pickVideo()`, `pickDocument()`, `hasBlockingAttachments`, lógica de audio/video/doc
- [x] Extraer hooks `useChatInput` y `useAutocomplete` de chat-input.tsx (~200 líneas target para el componente)
- [x] Eliminar `AttachmentType.AUDIO`, `.VIDEO`, `.DOCUMENT` de `chat.types.ts`
- [x] Agregar `Message.status` a `chat.types.ts`
- [x] Implementar status indicator en `ChatMessageBubble`
- [x] Actualizar `useConversation.ts` con optimistic status 'sending'→'sent' y consolidar `useChatInfo` dentro
- [x] Consolidar `useConversations` + `useChatSearch` en `useChatList`
- [x] Estandarizar strings del chat con i18n (core/i18n/es.ts)
- [x] Limpiar `chat.store.ts` (remover `activeReplyMessage`, `activeMenuMessage`, agregar estado de attachments/menciones)
- [x] Eliminar `socket.io-client` de package.json (previa confirmación)
- [x] Fix mock ID mismatch en `mock-chat.ts`

### Fase 2 — Correcciones UX
**Esfuerzo:** ~10h
**Checklist:**
- [x] Instalar `@react-native-community/datetimepicker`
- [x] Crear `core/components/DatePicker.tsx`
- [x] Reemplazar `DateOfBirthInput.tsx` con nuevo DatePicker
- [x] Extender `toast.store.ts` con variantes `warning`, `info`
- [x] Crear `core/components/ConfirmDialog.tsx` y `core/hooks/useConfirmDialog.ts`
- [x] Agregar `ConfirmDialogProvider` en `app/_layout.tsx`
- [x] Migrar 35+ `Alert.alert` a toast/confirmDialog (archivo por archivo)
- [x] Fix navegación post-login: `gestureEnabled: false` en tabs layout
- [x] Hashtags navegables en `PostCard` → push a `/explore?q=`
- [x] Leer query param en `ExploreScreen` y pre-poblar search
- [x] Agregar `SearchBar` a `FavoriteGamesView` con filtro `useMemo`
- [x] Crear `core/hooks/useNavigation.ts` con throttle de 500ms
- [x] Migrar 26 `useRouter` → `useNavigation` en ~15 archivos

### Fase 3 — Migración a Feature Folders
**Esfuerzo:** ~16h
**Checklist:**
- [x] Migrar `auth` feature (api, hooks, screens, types)
- [x] Migrar `feed` feature (PostCard unificado, feed component)
- [x] Migrar `post` feature (post-detail, comments, create)
- [x] Migrar `chat` feature (todos los componentes a `features/chat/`)
- [x] Migrar `game` feature (game profile, search)
- [x] Migrar `profile` feature (profile view, settings, favorites, change password)
- [x] Migrar `explore` feature (screen, sticky header, section cards)
- [x] Migrar `notifications` feature (screen, items, hooks)
- [x] **Migrar `useNotifications` a TanStack Query** (quitar useState/useEffect)
- [x] **Migrar `useMockGameProfile` a `useGameProfiles` con TanStack Query**
- [x] Unificar `PostCard`/`PostItem` con `variant` prop
- [x] Thin wrappers en `app/` (cada ruta < 40 líneas)

**Orden sugerido por feature:** auth → notifications → game → profile → feed → post → explore → chat (chat al final por ser el más complejo)

### Fase 4 — Polish
**Esfuerzo:** ~6h
**Checklist:**
- [x] Auditoría final de strings (idioma) — revisar cada archivo migrado
- [x] Auditoría de design tokens — reemplazar hardcodeados restantes
- [x] Ejecutar `npm run lint` y corregir errores
- [x] Ejecutar `npm run typecheck` y corregir errores
- [x] Verificar que todos los imports apuntan a las nuevas ubicaciones
- [x] Eliminar archivos viejos (src/components/, src/hooks/, src/store/, src/api/, src/lib/)
- [x] Actualizar `CONVENTIONS.md` con las nuevas reglas de feature folders
- [x] Documentar `normalizeText()` en core/utils/
- [ ] Prueba de humo: navegar por toda la app (requires emulator)

---

## 9. Reglas de Migración Segura

### Principio: Parallel Structure

NUNCA mover y modificar en el mismo commit. La migración sigue este flujo:

```
1. CREAR archivo nuevo (en features/ o core/) → COPIA EXACTA del original
2. MODIFICAR archivo nuevo (aplicar refactor, cleanup)
3. REEMPLAZAR import en el consumer (app/ u otros features) → apunta al nuevo
4. VERIFICAR que funciona (typecheck + lint + test manual)
5. ELIMINAR archivo original (solo cuando ningún consumer lo importe)
```

### Feature Flags

Para la migración a feature folders, mantener ambos sistemas funcionando en paralelo:
- Los archivos en `app/` pueden importar de `features/` o de `src/components/` viejos
- No eliminar archivos viejos hasta que todos los consumers estén migrados
- Usar el typecheck como verificación: si `npm run typecheck` pasa, la migración es segura

### Reglas por Tipo de Cambio

| Tipo de Cambio | Regla |
|----------------|-------|
| **Eliminar archivo** | 3 verificaciones: (1) grep del filename en todo el proyecto = 0, (2) typecheck pasa, (3) la app corre sin error |
| **Renombrar tipo/enum** | No hacer. Crear el nuevo nombre, migrar consumers, eliminar el viejo |
| **Mover archivo** | Usar `git mv` para mantener historia. Si no es posible, copiar y eliminar |
| **Cambiar firma de hook** | Hacer en 2 pasos: (1) agregar nueva firma como overload, (2) eliminar vieja cuando nadie la use |
| **Agregar dependencia npm** | `npx expo install [package]` (no `npm install`, usa la versión compatible con Expo) |

### Commit Strategy

Cada commit debe ser atómico y compilable:
```
<tipo>(<alcance>): <acción>

Ejemplos:
refactor(chat): remove audio/video/document attachment types
feat(core): add design tokens theme
fix(ux): replace DateOfBirthInput with native DatePicker
refactor(notifications): migrate useNotifications to TanStack Query
```

Ejecutar siempre antes de commit:
```bash
npm run lint && npm run typecheck
```

### Rollback Plan

Si un cambio rompe la app:
1. `git checkout <commit anterior>` en el archivo específico
2. Si son múltiples archivos, `git revert <commit-hash>`
3. Los archivos viejos en `src/` no se eliminan hasta Fase 4, lo que permite rollback rápido

---

## Apéndice A: Archivos a Eliminar (Lista Maestra)

### Fase 1 (Chat Cleanup)
| Archivo | Reemplazo |
|---------|-----------|
| `src/components/chat/bubble/audio-attachment.tsx` | Eliminar |
| `src/components/chat/bubble/video-attachment.tsx` | Eliminar |
| `src/components/chat/bubble/document-attachment.tsx` | Eliminar |
| `src/components/chat/bubble/full-screen-viewer.tsx` | Eliminar |
| `src/components/chat/media-preview-modal.tsx` | Eliminar |

### Fase 3 (Feature Migration)
| Archivo | Reemplazo |
|---------|-----------|
| `src/components/user/post-item.tsx` | `features/feed/components/PostCard.tsx` (con variant) |
| `src/components/user/user-profile.tsx` | `features/profile/components/ProfileView.tsx` |
| `src/components/auth/` (3 archivos) | `features/auth/components/` |
| `src/components/chat/` (~25 archivos) | `features/chat/components/` |
| `src/components/feed/feed.tsx` | `features/feed/components/Feed.tsx` |
| `src/components/posts/post-card.tsx` | `features/feed/components/PostCard.tsx` |
| `src/components/post-details/` (2 archivos) | `features/post/components/` |
| `src/components/explore/` (4 archivos) | `features/explore/components/` |
| `src/components/screen/notifications/` (3 archivos) | `features/notifications/components/` |
| `src/components/signup/DateOfBirthInput.tsx` | `features/auth/components/DateOfBirthPicker.tsx` |
| `src/components/user/change-password-view.tsx` | `features/profile/components/ChangePasswordView.tsx` |
| `src/components/user/edit-profile.tsx` | `features/profile/components/EditProfileView.tsx` |
| `src/components/user/favorite-games.tsx` | `features/profile/components/FavoriteGamesView.tsx` |
| `src/components/user/settings.tsx` | `features/profile/components/SettingsView.tsx` |
| `src/components/games/` (2 archivos) | `features/game/components/` |
| `src/components/create-post/` | `features/post/components/CreatePostScreen.tsx` |
| `src/hooks/chat/` (6 archivos) | `features/chat/hooks/` |
| `src/hooks/useAuth.ts` | `features/auth/hooks/` (4 hooks separados) |
| `src/hooks/useNotifications.ts` | `features/notifications/hooks/useNotifications.ts` |
| `src/hooks/mock-data/` (9 archivos) | `src/mocks/` + `features/*/hooks/` |
| `src/api/chat.api.ts` | `features/chat/api/chat.api.ts` |
| `src/api/auth.api.ts` | `features/auth/api/auth.api.ts` |
| `src/api/game.api.ts` | `features/game/api/game.api.ts` |
| `src/api/notifications.ts` | `features/notifications/api/notifications.api.ts` |
| `src/store/chat.store.ts` | `features/chat/store/chat.store.ts` |
| `src/store/post.store.ts` | `features/feed/store/post.store.ts` |
| `src/store/auth.store.ts` | `core/store/auth.store.ts` |
| `src/store/user.store.ts` | `core/store/user.store.ts` |
| `src/store/toast.store.ts` | `core/store/toast.store.ts` |
| `src/types/chat.types.ts` | `features/chat/types/chat.types.ts` |
| `src/types/auth.types.ts` | `core/types/auth.types.ts` |
| `src/types/user.types.ts` | `core/types/user.types.ts` |
| `src/types/post.types.ts` | `core/types/post.types.ts` |
| `src/types/game.types.ts` | `core/types/game.types.ts` |
| `src/lib/secure-store.ts` | `core/lib/secure-store.ts` |
| `src/components/ui/app-toast.tsx` | `core/components/AppToast.tsx` |
| `src/components/ui/SearchBar.tsx` | `core/components/SearchBar.tsx` |

---

## Apéndice B: Mapa de Dependencias Nuevas

| Dependencia | Versión | Para qué | Instalar con |
|-------------|---------|----------|--------------|
| `@react-native-community/datetimepicker` | Última compatible con Expo 54 | DatePicker nativo en signup y perfil | `npx expo install @react-native-community/datetimepicker` |
