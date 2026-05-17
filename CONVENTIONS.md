# CONVENTIONS.md — GameConnect Mobile

Guía de convenciones para el equipo de desarrollo. Léela antes de escribir tu primera línea de código.
Este documento es un acuerdo del equipo, no una sugerencia.

---

## Tabla de contenido

1. [Estructura de carpetas](#1-estructura-de-carpetas)
2. [Nomenclatura](#2-nomenclatura)
3. [Reglas por capa](#3-reglas-por-capa)
4. [Antes de crear cualquier archivo](#4-antes-de-crear-cualquier-archivo)
5. [Gitflow](#5-gitflow)
6. [Git commit verbs](#6-git-commit-verbs)

---

## 1. Estructura de carpetas

```
gameconnect-mobile/
├── app/          → Solo rutas (Expo Router). Cero lógica aquí.
├── src/
│   ├── api/      → Funciones que hablan con el backend. Solo fetch.
│   ├── store/    → Estado global que NO viene del servidor (Zustand).
│   ├── hooks/    → Lógica React reutilizable. Aquí vive TanStack Query.
│   ├── components/
│   │   ├── ui/   → Bloques base reutilizables en toda la app.
│   │   └── [feature]/  → Componentes específicos de una feature.
│   ├── lib/      → Configuración de librerías externas.
│   └── types/    → Interfaces y tipos TypeScript globales.
└── assets/
```

**Regla de oro:** `app/` es el mapa. `src/` es el trabajo real.
Una pantalla en `app/` debería ser un ensamblador que importa de `src/`, no un lugar donde se escribe lógica.

---

## 1.1. Estructura de rutas (app/)

Expo Router usa el sistema de archivos como router.
Cada archivo en app/ es una ruta. Nada más vive aquí.

app/
├── _layout.tsx              # Root Stack — envuelve toda la app
├── index.tsx                # Splash → redirect a (auth) o (tabs)
├── +not-found.tsx           # 404
│
├── (auth)/                  # Stack sin bottom bar
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
│
├── (tabs)/                  # Tab layout — bottom bar persistente
│   ├── _layout.tsx
│   ├── index.tsx            # INICIO — Feed
│   ├── favorites.tsx        # FAVORITOS
│   ├── create.tsx           # CREAR PUBLICACIÓN
│   ├── notifications.tsx    # NOTIFICACIONES
│   └── profile.tsx          # PERFIL propio
│
├── explore.tsx              # Modal — ícono búsqueda en header
├── settings/
│   └── index.tsx            # Stack push — ícono ⚙️ desde perfil propio
├── chat/
│   ├── index.tsx            # Stack push — lista de conversaciones
│   └── [id].tsx             # Stack push — conversación individual
├── user/
│   └── [id].tsx             # Stack push — perfil de otro usuario
└── game/
    ├── [id].tsx             # Stack push — perfil de un juego
    └── [id]/
        └── settings.tsx     # Stack push — ajustes del juego (solo owner)

Reglas:
- Nadie hace lógica en app/. Solo importar desde src/.
- Las rutas dinámicas ([id].tsx) reciben el ID via useLocalSearchParams().
- Los grupos con paréntesis (auth), (tabs) agrupan rutas sin afectar la URL.

## 2. Nomenclatura

### Archivos y carpetas

| Tipo | Convención | Ejemplo |
|---|---|---|
| Carpetas | kebab-case | `user-profile/` |
| Componentes | kebab-case | `post-card.tsx` |
| Hooks | kebab-case con prefijo `use-` | `use-feed.ts` |
| Stores | kebab-case con sufijo `.store` | `auth.store.ts` |
| API files | kebab-case con sufijo `.api` | `favorites.api.ts` |
| Types | kebab-case con sufijo `.types` | `post.types.ts` |
| Lib/config | kebab-case | `query-client.ts` |

### Variables y funciones

| Tipo | Convención | Ejemplo |
|---|---|---|
| Variables y funciones | camelCase | `accessToken`, `getUserById` |
| Componentes React | PascalCase | `PostCard`, `SaveButton` |
| Tipos e interfaces TS | PascalCase | `Post`, `UserProfile` |
| Constantes globales | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE` |
| Enums | PascalCase | `NotificationType.LIKE` |

### Nombrado semántico

Los nombres describen **qué son o qué devuelven**, no cómo funcionan internamente.

```
✅ use-favorites.ts       → devuelve la lista de favoritos
✅ use-toggle-favorite.ts → devuelve la acción de guardar/quitar
✅ favorites.api.ts       → funciones de la API de favoritos

❌ fetchData.ts
❌ useHelper.ts
❌ utils2.ts
```

---

## 3. Reglas por capa

### `src/types/`
- Definir los tipos **antes** de trabajar en cualquier otra capa.
- Un archivo por dominio: `post.types.ts`, `user.types.ts`, `chat.types.ts`.
- Los tipos deben reflejar exactamente la forma que devuelve la API. Si la API cambia, el tipo cambia primero.

### `src/api/`
- Un archivo por dominio: `feed.api.ts`, `chat.api.ts`, etc.
- Solo funciones puras que llaman a `apiClient`. Sin hooks, sin estado.
- Ninguna pantalla ni hook hace `fetch` directamente. Siempre a través de este layer.

```
✅ const getFavorites = () => apiClient<Favorite[]>('/favorites')
❌ const res = await fetch('/api/favorites') // dentro de un componente
```

### `src/hooks/`
- Subcarpeta por dominio: `hooks/favorites/`, `hooks/feed/`, etc.
- Todos los `useQuery` y `useMutation` de TanStack Query viven aquí.
- El nombre describe lo que devuelve, no la operación HTTP.
- Un hook = una responsabilidad. Si un hook hace demasiado, se divide.

### `src/components/ui/`
- Esta carpeta es **propiedad compartida de todo el equipo**.
- Antes de crear un componente nuevo, busca aquí si algo similar ya existe.
- Los componentes de `ui/` no conocen la API ni el store. Son puramente visuales.
- Reciben datos y callbacks por props. No tienen lógica de negocio.
- Si necesitas extender uno, hazlo con props opcionales, no duplicándolo.

### `src/components/[feature]/`
- Componentes que solo se usan en una feature específica.
- Pueden usar hooks, pero no deben hacer fetch directamente.

### `src/store/`
- Solo estado que no es del servidor: sesión, UI state, contadores en tiempo real.
- No guardar aquí datos que TanStack Query puede manejar (posts, perfiles, etc.).
- Si dudas entre Zustand y TanStack Query: si viene de la API, es TanStack Query.

### `app/`
- Las pantallas solo importan de `src/`. No tienen lógica propia.
- Un archivo de pantalla no debería superar las 80 líneas en la mayoría de casos.
- No hay fetch, no hay lógica de negocio, no hay estilos complejos inline.

---

## 4. Antes de crear cualquier archivo

Sigue este checklist en orden antes de crear algo nuevo:

1. **¿Ya existe?** Busca en `src/components/ui/`, `src/hooks/` y `src/api/` antes de crear.
2. **¿Es reutilizable?** Si lo van a usar más de una pantalla, va en una carpeta compartida.
3. **¿Está en el lugar correcto?** Revisa la tabla de la sección 1.
4. **¿El nombre es claro?** Otro dev debería entender qué hace sin abrirlo.
5. **¿Avisaste al equipo?** Si creaste algo reutilizable nuevo, comunícalo en el canal de desarrollo.

---

## 5. Gitflow

Usamos una versión simplificada de Gitflow adaptada a un equipo de 5 personas.

### Ramas permanentes

| Rama | Propósito |
|---|---|
| `main` | Producción. Solo recibe merges de `release/`. Nunca se toca directamente. |
| `develop` | Rama de integración. Todos los features se mergean aquí. |

### Ramas temporales

| Rama | Cuándo se crea | Desde | Se mergea a |
|---|---|---|---|
| `feature/[nombre]` | Nueva funcionalidad | `develop` | `develop` |
| `fix/[nombre]` | Bug que no es urgente | `develop` | `develop` |
| `hotfix/[nombre]` | Bug crítico en producción | `main` | `main` y `develop` |
| `release/[version]` | Preparar una entrega | `develop` | `main` y `develop` |

### Nombrado de ramas

```
feature/favorites-screen
feature/auth-login
fix/feed-infinite-scroll
fix/chat-reconnect
hotfix/token-refresh-crash
release/1.0.0
```

Siempre kebab-case, siempre descriptivo, sin números de ticket a menos que el equipo lo acuerde.

### Flujo del día a día

```
1. Partir siempre desde develop actualizado
   git checkout develop
   git pull origin develop

2. Crear la rama del feature
   git checkout -b feature/favorites-screen

3. Trabajar y hacer commits frecuentes

4. Antes de abrir PR, actualizar con develop
   git fetch origin
   git rebase origin/develop

5. Abrir Pull Request → develop
   - Título descriptivo
   - Al menos 1 reviewer del equipo
   - No se mergea sin aprobación

6. Después del merge, borrar la rama remota
```

### Reglas de ramas

- Nadie hace push directo a `main` ni a `develop`.
- Todo cambio entra por Pull Request.
- Una rama = una feature o un fix. No mezclar trabajo.
- Si una rama lleva más de 3 días sin mergearse, hay que revisar si está muy grande y dividirla.

---

## 6. Git commit verbs

Usamos **Conventional Commits**. El formato es siempre:

```
<tipo>(<scope>): <descripción en imperativo, minúsculas>
```

El `scope` es opcional pero recomendado. Describe la parte del proyecto afectada.

```
feat(favorites): add toggle favorite mutation
fix(auth): handle expired refresh token correctly
```

### Tipos de commit

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad visible para el usuario |
| `fix` | Corrección de un bug |
| `refactor` | Cambio de código que no añade feature ni corrige bug |
| `style` | Cambios de formato, espaciado, nombres sin afectar lógica |
| `chore` | Tareas de mantenimiento: dependencias, configs, scripts |
| `docs` | Cambios en documentación o comentarios |
| `test` | Añadir o modificar tests |
| `perf` | Mejoras de rendimiento |
| `revert` | Revertir un commit anterior |

### Ejemplos reales para este proyecto

```bash
feat(auth): implement login screen with JWT flow
feat(feed): add infinite scroll to post list
feat(favorites): add save button with optimistic update
feat(chat): connect socket on conversation open

fix(auth): redirect to login on refresh token expiry
fix(feed): prevent duplicate posts on refetch
fix(chat): reconnect socket after app comes to foreground

refactor(api): extract apiClient error handling to separate function
refactor(hooks): split use-profile into use-own-profile and use-user-profile

style(components): apply consistent spacing to post-card
chore(deps): remove expo-media-library and react-native-web
chore(config): add BASE_URL to app.config.ts env vars

docs(conventions): add git commit examples section
```

### Reglas de commits

- La descripción va en **imperativo presente**: "add feature" no "added feature" ni "adding feature".
- Máximo 72 caracteres en la primera línea.
- Sin punto final.
- Commits pequeños y frecuentes. Un commit = un cambio coherente.
- No commitear archivos generados (`dist/`, `node_modules/`).
- No commitear `.env` ni archivos con credenciales.

---

## Resumen rápido para tener siempre presente

```
¿Dónde va este archivo?        → Sección 1
¿Cómo lo nombro?               → Sección 2
¿Qué puede y no puede hacer?   → Sección 3
¿Ya existe algo parecido?      → Sección 4
¿Cómo nombro mi rama?          → Sección 5
¿Cómo escribo el commit?       → Sección 6
```
