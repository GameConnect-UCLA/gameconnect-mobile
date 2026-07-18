# CONVENTIONS.md — GameConnect Mobile

Guía de convenciones para el equipo de desarrollo.

---

## 1. Estructura de carpetas

```
gameconnect-mobile/
├── app/                  → Solo rutas (Expo Router). < 40 líneas cada una.
├── src/
│   ├── core/             → Infraestructura compartida
│   │   ├── components/   → UI atómicos reutilizables (Button, Avatar, DatePicker)
│   │   ├── hooks/        → Hooks genéricos (useDebounce, useNavigation, useConfirmDialog)
│   │   ├── i18n/         → Archivos de idioma
│   │   ├── lib/          → Config: query-client, secure-store
│   │   ├── store/        → Stores globales compartidos (toast, user)
│   │   ├── theme/        → Design tokens (Colors, Spacing, Radii, Typography, Shadows)
│   │   ├── types/        → Tipos core (user, post, chat, game)
│   │   └── utils/        → Utilidades puras (normalizeText, string)
│   │
│   ├── features/         → Feature folders — cada dominio tiene su propia estructura
│   │   ├── auth/         → api/, components/, hooks/, screens/, store/, types/
│   │   ├── chat/
│   │   ├── explore/
│   │   ├── feed/
│   │   ├── game/
│   │   ├── notifications/
│   │   ├── post/
│   │   └── profile/
│   │
│   ├── lib/              → Librerías externas (secure-store)
│   ├── mocks/            → Datos mock para desarrollo
│   ├── store/            → Stores legacy que re-exportan desde features/
│   ├── types/            → Types legacy que re-exportan desde features/
│   └── api/              → API legacy que re-exporta desde features/
│
└── assets/
```

**Regla de oro:** `app/` es el mapa. `features/` es el trabajo real.
Cada ruta en `app/` importa un componente de `features/` y no supera 40 líneas.

---

## 1.1. Feature folder structure

Cada feature en `src/features/[feature]/` sigue esta estructura:

```
features/auth/
├── api/           → auth.api.ts (funciones fetch)
├── components/    → AuthBackground.tsx, AuthCard.tsx
├── hooks/         → useLogin.ts, useSignup.ts, useLogout.ts, useSessionCheck.ts
├── screens/       → LoginScreen.tsx, SignUpScreen.tsx, ForgotScreen.tsx, RecoveryScreen.tsx
├── store/         → auth.store.ts (Zustand)
└── types/         → auth.types.ts
```

Los componentes de `features/[feature]/components/` se nombran en PascalCase.

---

## 1.2. Parallel Structure (Re-exports)

Los archivos legacy en `src/api/`, `src/hooks/`, `src/store/`, `src/types/` que fueron migrados a `features/` se convierten en re-exports:

```ts
// src/hooks/useAuth.ts → re-export desde features/
export { useLogin, useSignup, useLogout, useSessionCheck } from '@/src/features/auth/hooks'
```

Esto permite que código antiguo siga funcionando mientras se actualizan los imports.

---

## 2. Nomenclatura

### Archivos y carpetas

| Tipo | Convención | Ejemplo |
|---|---|---|
| Carpetas feature | kebab-case | `favorites` |
| Componentes | PascalCase | `PostCard.tsx` |
| Hooks | camelCase con prefijo `use` | `useAutocomplete.ts` |
| Stores | kebab-case con sufijo `.store` | `auth.store.ts` |
| API files | kebab-case con sufijo `.api` | `auth.api.ts` |
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

---

## 3. Reglas por capa

### `src/core/`

- **theme/**: Design tokens. NO usar valores hardcodeados en features/ (colores, espaciados, radios). Siempre importar de `Colors.xxx`, `Spacing.xxx`, `Radii.xxx`.
- **components/**: UI atómicos sin lógica de negocio. Button, Avatar, DatePicker, ConfirmDialog.
- **hooks/**: Hooks genéricos: `useNavigation` (throttled router), `useDebounce`, `useConfirmDialog`.
- **store/**: Stores compartidos entre features (toast, user global).
- **utils/**: Funciones puras. `normalizeText()` para búsqueda sin acentos.
- **lib/**: Config de librerías externas (TanStack Query client, secure-store wrapper).

### `src/features/[feature]/`

- **api/**: Funciones fetch. Sin hooks, sin estado. Cada función es `async`.
- **hooks/**: Todos los `useQuery` y `useMutation` de TanStack Query viven aquí.
  - Un hook = una responsabilidad.
  - `useGameProfiles()` → `useQuery({ queryKey: ['gameProfiles'], queryFn: fetchGameProfiles })`
- **components/**: Componentes de la feature. Pueden usar hooks de la feature.
- **screens/**: Pantallas exportadas a `app/`. Reciben props si necesitan datos del route.
- **store/**: Estado Zustand específico de la feature (no viene de API).
- **types/**: Tipos específicos de la feature.

### `app/`

- Las pantallas solo importan de `features/`. No tienen lógica propia.
- No superan 40 líneas.
- No hay fetch, no hay lógica de negocio, no hay estilos inline.

---

## 4. normalizeText()

Ubicación: `src/core/utils/string.ts`

```ts
export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
```

**Qué hace:** Normaliza texto para búsqueda case-insensitive sin acentos.
"José" → "jose", "MÉXICO" → "mexico", "cañón" → "canon".

**Cuándo usarlo:** Para filtrar/buscar en colecciones locales (favorite-games, explore).

---

## 5. TanStack Query Convention

```ts
// ✅ Correcto
export const useGameProfiles = () => {
  return useQuery({
    queryKey: ['gameProfiles'],
    queryFn: fetchGameProfiles,
    staleTime: 60000,
  })
}

// ❌ Incorrecto — no usar useState/useEffect para datos de API
const [data, setData] = useState([])
useEffect(() => { fetch().then(setData) }, [])
```

**Reglas:**
- `staleTime` mínimo 30s para datos que cambian poco (notificaciones, perfiles).
- Optimistic updates con `onMutate` para acciones de usuario (accept/reject follow).
- `queryClient.setQueryData` para actualizaciones locales sin invalidar.

---

## 6. Thin wrappers in app/

Cada ruta en `app/` debe ser un thin wrapper (< 40 líneas):

```tsx
// app/(tabs)/notifications.tsx ✅
import NotificationsScreen from '@/src/features/notifications/components/NotificationsScreen'

export default function NotificationsRoute() {
  return <NotificationsScreen />
}
```

```tsx
// app/(tabs)/profile.tsx ✅
import ProfileView from '@/src/features/profile/components/ProfileView'
import { useMockUser } from '@/src/features/profile/hooks/useCurrentUser'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function ProfileScreen() {
  const { push, back } = useNavigation()
  const user = useMockUser()
  return <ProfileView user={user} isSelf={true} ... />
}
```

---

## 7. Errores comunes

| Error | Causa | Fix |
|---|---|---|
| `Module has no exported member` | Import de archivo stub con `// TODO` | Migrar contenido real o crear re-export |
| `Cannot find module` | Ruta incorrecta o archivo eliminado sin actualizar imports | Verificar path con `@/src/features/...` |
| `Object literal may only specify known properties` | Prop inexistente en tipo | Revisar type definition |
| `'e' is of type 'unknown'` | Catch sin tipo | Usar `instanceof` o `as Error` |

---

## 8. Resumen rápido

```
¿Feature nueva?          → src/features/[feature]/{api,components,hooks,screens,store,types}/
¿Componente compartido?  → src/core/components/
¿Hook genérico?          → src/core/hooks/
¿Design token?           → src/core/theme/
¿Thin wrapper?           → app/[route].tsx (< 40 líneas)
¿Re-export legacy?       → exportar desde features/ con alias
¿Datos de API?           → TanStack Query, no useState/useEffect
¿Estado local?           → Zustand
```
