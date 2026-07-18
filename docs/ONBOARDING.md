# Onboarding — GameConnect Mobile

Guía rápida para que un desarrollador nuevo tenga la app corriendo y entienda el mapa del proyecto.

---

## Prerrequisitos

- **Node.js** v18+
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli` (solo para builds)
- **Android Studio** (emulador) o dispositivo físico con [development build](#development-build) instalado
- **Backend GameConnect** corriendo (o los mocks integrados en el frontend)

---

## Setup

```bash
# 1. Clonar
git clone https://github.com/[org]/gameconnect-mobile.git
cd gameconnect-mobile

# 2. Dependencias
npm install

# 3. Variables de entorno
cp .env.example .env
# Edita .env con tus valores (API_URL, etc.)

# 4. Generar proyecto nativo (solo primera vez o tras cambios en app.json / package.json)
npm run prebuild

# 5. Iniciar
npm run start
# Presiona 'a' para abrir en el emulador Android
```

---

## Development build

Este proyecto usa **Expo Development Builds** (no Expo Go). Necesitas un APK
de desarrollo instalado en tu dispositivo/emulador. Una vez instalado, los
cambios en código JS/TS se reflejan al instante via Fast Refresh.

Solo necesitas regenerar el APK si agregas dependencias nativas, cambias
`app.json`, o modificas `android/`.

```bash
# Build en la nube (consume cuota EAS)
npm run build:dev

# Build local (no consume cuota)
eas build --profile development --platform android --local
```

---

## Daily workflow

```
1. Escribir código
2. npm run start            → Fast Refresh en emulador
3. npm run lint             → ESLint
4. npm run typecheck        → TypeScript
5. git commit               → Conventional Commits
6. Push → PR a dev          → EAS Update automático (si solo JS)

Si hay cambios nativos → npm run build:dev
```

---

## Where is everything

```
app/                              ── Routes (Expo Router, thin wrappers <40 lines)
  (auth)/                           Login, signup, forgot, recovery
  (tabs)/                           Feed, notifications, profile, create, favorites
  chat/                             Chat list, room, info, new group
  game/[id]/                        Game profile, settings
  post/[id].tsx                     Post detail
  user/                             Edit profile, settings, change password, favorite games
  explore.tsx                       Explore screen

src/
  core/                             Shared infrastructure
    api/                              HTTP client, contracts, socket, mock handlers
    components/                       UI atoms (Button, Avatar, SearchBar, etc.)
    hooks/                            Generic hooks (useNavigation, useDebounce, useConfirmDialog)
    store/                            Global Zustand stores (auth, user, toast)
    theme/                            Design tokens (Colors, Spacing, Radii, Typography, Shadows)
    i18n/                             All UI strings in Spanish (es.ts)
    lib/                              Third-party wrappers (secure-store, query-client)
    utils/                            Pure utility functions (normalizeText)
    types/                            Barrel re-exports of canonical feature types

  features/                         Domain modules
    auth/                             api/, hooks/, components/, screens/, store/, types/
    chat/                             api/, hooks/, components/, screens/, store/, types/
    explore/                          components/, utils/
    feed/                             components/, store/
    game/                             api/, hooks/, components/, types/
    notifications/                    api/, hooks/, components/, types/
    post/                             api/, hooks/, components/, types/
    profile/                          hooks/, components/, types/

  mocks/                            Flat mock data (temporary, removed as backend ships)
```

**Canonical types:** Every type lives in its feature's `types/` folder.
Re-exported via `core/types/` for cross-feature consumption.
**Never import from `src/types/`** (that directory was deleted in the documentation pass).

---

## Creating a new feature

```bash
# 1. Create folders
mkdir -p src/features/[feature]/{api,components,hooks,screens,store,types}

# 2. Create route in app/
touch app/[route].tsx
# Content: < 40 lines, imports screen from features/

# 3. If the feature exposes types needed by other features,
#    re-export from core/types/index.ts

# 4. If the feature needs API endpoints, add contracts to core/api/contracts/
```

---

## Conventions that will bite you

| Rule | Why |
|------|-----|
| No `useState`/`useEffect` for API data | Use TanStack Query (`useQuery`, `useMutation`) |
| No hardcoded colors/spacing | Import `Colors.primary`, `Spacing.lg`, etc. |
| No logic in `app/` | Thin wrappers < 40 lines, import from `features/` |
| No cross-feature imports | Shared types go in `core/types/` |
| Use `npx expo install` for native deps | Not `npm install` — ensures Expo compatibility |
| Use `useNavigation` not `useRouter` | `useNavigation` has 500ms throttle to prevent double-tap |

---

## Commands reference

```bash
npm run start              # Dev server
npm run start:clean        # Dev server (clear cache)
npm run android            # Run on Android emulator
npm run lint               # ESLint
npm run typecheck          # TypeScript check
npm run docs               # Generate TypeDoc docs → docs/api/
npm run docs:check         # TypeDoc with warnings as errors
npm run build:dev          # Development build (EAS cloud)
npm run clean              # Remove node_modules, .expo, dist
npm run clean:install      # Clean + reinstall
npm run doctor             # expo doctor diagnostics
```

---

## Troubleshooting

| Error | Likely cause | Fix |
|-------|-------------|-----|
| `Module has no exported member` | Importing from wrong barrel | Check the type's canonical location in `features/[feature]/types/` |
| `Cannot find module` | Path is wrong or file was moved | Use `@/src/` prefix, verify file exists |
| `Object literal may only specify known properties` | Field name mismatch | Editor showed 13 fields (Post) but you used 9 (old UserPost). Use `postTitle`, `likes_counter`, etc. |
| `'e' is of type 'unknown'` | Catch clause without type | Use `instanceof ApiError` or `as Error` |
| TypeDoc "entry point not referenced" | Directory/glob entry points | Safe to ignore — files are still compiled |

---

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — data flows, design decisions, technical debt
- [CONVENTIONS.md](../CONVENTIONS.md) — code style, naming, folder structure
- [dbschema.md](./dbschema.md) — database schema
- [schema-gaps.md](./schema-gaps.md) — frontend fields missing from DB
- [chat/refactor_plan.md](./chat/refactor_plan.md) — full migration plan
