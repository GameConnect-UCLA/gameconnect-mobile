# Documentation plan

## Estado del proyecto

- **TypeScript**: 0 errores actuales. `typecheck.log.txt` contiene 199 errores stale (pre-migración de feature folders) y debe eliminarse.
- **Dependencias circulares**: 0 detectadas por madge.
- **Migración feature-based**: completada. No existen directorios legacy (`src/components/`, `src/api/`, `src/store/`, `src/hooks/`). Quedan 7 imports a `@/src/types/` en lugar de `@/src/core/types` (5 en mocks, 2 en `features/post/`).
- **Tipos consolidados parcialmente**: `auth.types.ts` y `chat.types.ts` ya viven nativamente en `features/` con re-export desde `core/types/`. `post.types.ts`, `user.types.ts`, `game.types.ts` aún residen en el legacy `src/types/` con re-export desde `core/types/`. Pendiente mover el source y eliminar `src/types/`.
- **Duplicados de tipos**: `Post` vs `UserPost` y `Comment` vs `UserPostComment` definen el mismo concepto con campos distintos (`src/types/post.types.ts` vs `src/types/user.types.ts`). Requiere análisis y unificación.
- **Stubs y placeholders**: 5 archivos son re-exports o placeholders (`auth.store.ts`, `useChatInput.ts`, `PostItem.tsx`, `GameSearchModal.tsx`, `GameInfoCardDisplay.tsx`). Se eliminarán y sus consumidores migrarán al archivo real.
- **Deuda técnica marcada**: `useChatSearch.ts:7` (stub API futura), `explore.utils.ts:25` (categoría `'TODO'` placeholder).
- **normalizeText duplicado**: en `core/utils/string.ts` (canónico) y `features/explore/utils/explore.utils.ts` (copia). Se migrarán consumidores y se eliminará la copia.
- **JSDoc**: cero cobertura en todo el proyecto.
- **TypeDoc**: disponible via `npx typedoc` v0.28.19. Sin `typedoc.json`.
- **Documentación existente**: `CONVENTIONS.md` (228 líneas), `README.md` (237 líneas), `docs/dbschema.md` (233 líneas), `docs/schema-gaps.md` (135 líneas), `docs/chat/refactor_plan.md` (930 líneas).
- **Backend**: comienza desarrollo esta semana. Los mocks son temporales y se eliminarán progresivamente.
- **Contratos API** (`src/core/api/contracts/`): aspiracionales, sujetos a modificación cuando el backend los implemente.

## Fases de ejecución

Cada fase tiene:
- **Objetivo**: qué se logra al completarla
- **Comandos / acciones**: exactamente qué correr o editar
- **Criterio de verificación**: cómo saber que está bien hecha antes de continuar
- **Archivos afectados**: lista concreta, no genérica
- **Pausa para revisión humana**: sí / no — y por qué

---

### Fase 1 — Limpieza previa a la documentación

**Objetivo**: Eliminar artefactos que harían incorrecta la documentación generada: unificar tipos duplicados (Post/UserPost), migrar normalizeText() duplicado, eliminar stubs, mover tipos legacy a features, eliminar `src/types/`, corregir imports.

**Comandos / acciones**:

1. Eliminar `typecheck.log.txt` (stale, pre-migración):
   ```bash
   rm typecheck.log.txt
   ```
2. Eliminar `src/types/README.md` (archivo vacío, 0 bytes).
3. Analizar diferencias entre `Post` (post.types.ts) y `UserPost` (user.types.ts), proponer unificación, ejecutarla, actualizar consumidores.
4. Eliminar `normalizeText()` duplicado de `features/explore/utils/explore.utils.ts` y migrar consumidores a `core/utils/string.ts`.
5. Eliminar los 5 stubs:
   - `src/features/auth/store/auth.store.ts` (re-export de core → consumidores importan directo de core)
   - `src/features/chat/hooks/useChatInput.ts` (placeholder) — verificar si hay imports
   - `src/features/profile/components/PostItem.tsx` (re-export de PostCard)
   - `src/features/game/components/GameSearchModal.tsx` (re-export de chat)
   - `src/features/game/components/GameInfoCardDisplay.tsx` (placeholder)
6. Mover físicamente los tipos que aún están en `src/types/` a sus ubicaciones canónicas:
   - `src/types/post.types.ts` → `src/features/post/types/post.types.ts` (crear con contenido real)
   - `src/types/user.types.ts` → `src/features/profile/types/user.types.ts` (crear con contenido real)
   - `src/types/game.types.ts` → merge con `src/features/game/types/game.types.ts` si tiene contenido adicional
   - `src/types/chat.types.ts` → ya es un re-export de `features/chat/types/chat.types.ts`, verificar
   - `src/types/auth.types.ts` → ya es un re-export de `features/auth/types/auth.types.ts`, verificar
7. Actualizar re-exports en `src/core/types/`:
   - `core/types/post.types.ts` → re-export desde `features/post/types/post.types`
   - `core/types/user.types.ts` → re-export desde `features/profile/types/user.types`
   - `core/types/game.types.ts` → ya re-exporta desde `features/game/types/game.types`
8. Actualizar los 7 imports que apuntan a `@/src/types/` → `@/src/core/types`.
9. Confirmar que 0 imports apuntan a `@/src/types/`.
10. Eliminar el directorio `src/types/`.
11. Correr `npm run typecheck` — debe dar 0 errores.

**Criterio de verificación**:
- `typecheck.log.txt` no existe.
- `src/types/` no existe.
- `grep -r "from '@/src/types/" src/` retorna vacío.
- `grep -r "from '@/src/features/auth/store/auth.store"` retorna vacío (consumidores migrados a core).
- `grep -r "useChatInput" src/ --include="*.ts" --include="*.tsx"` retorna solo la definición o vacío.
- `grep -r "normalizeText" src/features/explore/` retorna vacío (solo uso del core).
- `npx tsc --noEmit` termina con exit code 0 y sin output.

**Archivos afectados**:
- `typecheck.log.txt` (eliminar)
- `src/types/README.md` (eliminar)
- `src/types/` (eliminar directorio — 6 archivos: auth.types.ts, chat.types.ts, game.types.ts, post.types.ts, user.types.ts, README.md)
- `src/features/auth/store/auth.store.ts` (eliminar stub)
- `src/features/chat/hooks/useChatInput.ts` (eliminar placeholder)
- `src/features/profile/components/PostItem.tsx` (eliminar stub re-export)
- `src/features/game/components/GameSearchModal.tsx` (eliminar stub re-export)
- `src/features/game/components/GameInfoCardDisplay.tsx` (eliminar placeholder)
- `src/features/post/types/post.types.ts` (crear — mover contenido desde src/types/post.types.ts)
- `src/features/profile/types/user.types.ts` (crear — mover contenido desde src/types/user.types.ts)
- `src/features/game/types/game.types.ts` (merge con src/types/game.types.ts si tiene contenido adicional)
- `src/core/types/post.types.ts` (actualizar re-export)
- `src/core/types/user.types.ts` (actualizar re-export)
- `src/core/types/index.ts` (posibles ajustes de re-export)
- `src/mocks/mock-game.ts` (FIX import path)
- `src/mocks/mock-favorite-games.ts` (FIX import path)
- `src/mocks/mock-posts.ts` (FIX import path)
- `src/mocks/mock-user.ts` (FIX import path)
- `src/features/post/api/post.api.ts` (FIX import path)
- `src/features/post/hooks/useCreatePost.ts` (FIX import path)
- `src/features/explore/utils/explore.utils.ts` (eliminar normalizeText duplicado)
- Consumidores de normalizeText() si usan la copia de explore (verificar)

**Pausa para revisión humana**: Sí — para revisar el análisis de unificación Post/UserPost antes de proceder a Fase 2.

---

### Fase 2 — Anotación JSDoc completa de todas las features

**Objetivo**: Que un desarrollador junior pueda abrir cualquier archivo de `src/features/` o `src/core/` y entender qué hace, qué recibe y qué devuelve sin leer la implementación. Cubre: contratos API, hooks, stores, API functions, helpers, utilidades, constantes, tipos exportados y componentes core.

**Regla**: Todo archivo `.ts`/`.tsx` que no sea mock recibe al menos un `/** */` a nivel de módulo. Cada export público recibe `@param` y `@returns` cuando aplique.

**Orden de ejecución por prioridad**:
1. Auth (7 archivos)
2. Chat (40 archivos)
3. Feed (4 archivos)
4. Notifications (8 archivos)
5. Post (5 archivos)
6. Game (6 archivos)
7. Profile (7 archivos)
8. Explore (5 archivos)
9. Core (30 archivos: contracts, hooks, stores, components, utils, lib, theme, i18n)
10. Types y barrels (5 archivos)

**Criterio de verificación**:
- `grep -c "/\*\*"` en cada archivo documentado devuelve al menos 1.
- `npx tsc --noEmit` = 0 errores.
- `npm run lint` = sin nuevos errores.

**Pausa para revisión humana**: No — anotaciones que no cambian comportamiento. Commit entre Fase 2 y 3.

---

### Fase 3 — Configuración y ejecución de TypeDoc

**Objetivo**: Instalar TypeDoc, crear `typedoc.json` con entrypoints correctos, generar documentación de referencia de API, verificar.

**Comandos / acciones**:

1. Instalar TypeDoc como devDependency:
   ```bash
   npm install --save-dev typedoc
   ```
2. Crear `typedoc.json` en la raíz:
   ```json
   {
     "$schema": "https://typedoc.org/schema.json",
     "entryPoints": [
       "src/core/api/client.ts",
       "src/core/api/ApiError.ts",
       "src/core/api/socket.ts",
       "src/core/api/mock-socket.ts",
       "src/core/api/contracts/",
       "src/core/hooks/",
       "src/core/store/",
       "src/core/utils/",
       "src/core/lib/",
       "src/core/theme/",
       "src/core/i18n/",
       "src/core/components/",
       "src/features/auth/",
       "src/features/chat/",
       "src/features/explore/",
       "src/features/feed/",
       "src/features/game/",
       "src/features/notifications/",
       "src/features/post/",
       "src/features/profile/"
     ],
     "out": "docs/api",
     "exclude": [
       "**/mocks/**",
       "**/node_modules/**",
       "**/*.test.*",
       "**/*.spec.*"
     ],
     "excludeExternals": true,
     "excludePrivate": true,
     "tsconfig": "tsconfig.json",
     "readme": "none",
     "name": "GameConnect Mobile API Reference",
     "includeVersion": true,
     "searchInComments": true,
     "sort": ["source-order"],
     "kindSortOrder": ["Function", "Interface", "TypeAlias", "Variable", "Class", "Enum"]
   }
   ```
3. Correr TypeDoc:
   ```bash
   npx typedoc
   ```
4. **No agregar a `.gitignore`** — `docs/api/` se commitea para GitHub Pages sin paso de CI.
5. Agregar scripts al `package.json`:
   ```json
   "docs": "typedoc",
   "docs:check": "typedoc --treatWarningsAsErrors"
   ```

**Criterio de verificación**:
- `docs/api/index.html` existe y tiene más de 5KB.
- `npx typedoc` = exit code 0, 0 warnings.
- `npm run docs` funciona sin `npx`.

**Pausa para revisión humana**: Sí — abrir `docs/api/index.html` en el navegador y verificar agrupación correcta por feature y capa.

---

### Fase 4 — Documentación de arquitectura

**Objetivo**: Crear `docs/ARCHITECTURE.md` explicando el flujo de datos entre features, decisiones de diseño no obvias, y el rol de cada capa.

**Comandos / acciones**:

1. Crear `docs/ARCHITECTURE.md` con secciones:
   a. Diagrama de capas (app → features → core)
   b. Tabla de flujo de datos por feature (8 features)
   c. Flujo de autenticación completo
   d. Sistema de diseño (theme, core components)
   e. Internacionalización (i18n)
   f. Sistema WebSocket (mock → real)
   g. Sistema HTTP y mocks
   h. Decisiones de diseño no obvias (useNavigation throttle, ConfirmDialog global, PostCard variant, normalizeText)
   i. Deuda técnica conocida (Post/UserPost, normalizeText duplicado, useChatSearch stub, placeholder TODO)
   j. Stubs eliminados (por qué se eliminaron y a dónde fueron los consumidores)

**Criterio de verificación**:
- `docs/ARCHITECTURE.md` existe y tiene más de 150 líneas.
- Contiene las 10 secciones.

**Pausa para revisión humana**: Sí — obligatorio. Validar secciones (c), (f), (h) y (i).

---

### Fase 5 — Documentación de onboarding

**Objetivo**: Crear `docs/ONBOARDING.md` con los pasos reales para un desarrollador nuevo.

**Comandos / acciones**:

1. Crear `docs/ONBOARDING.md` con secciones: prerrequisitos, setup paso a paso, flujo diario, mapa de carpetas, cómo crear una feature nueva, convenciones críticas, comandos, troubleshooting.
2. Verificar que todos los comandos listados funcionan.

**Criterio de verificación**:
- `docs/ONBOARDING.md` existe y tiene más de 80 líneas.
- Todos los comandos se ejecutaron sin error.

**Pausa para revisión humana**: Sí — probar con un miembro del equipo que no haya hecho setup.

---

### Fase 6 — Verificación final

**Objetivo**: Regeneración limpia, links internos, checklist de completitud.

**Comandos / acciones**:

1. Regenerar TypeDoc desde cero:
   ```bash
   rm -rf docs/api && npm run docs
   ```
2. Verificar links internos entre documentos de `docs/`.
3. Checklist final de 10 items.

**Criterio de verificación**: Los 10 items del checklist marcados. Todo commiteable.

**Pausa para revisión humana**: No.

---

## Archivos que NO se documentan

| Archivo | Razón |
|---|---|
| `src/mocks/` (7 archivos) | Datos mock temporales, se eliminan cuando el backend esté estable. |
| `src/core/api/mocks/` (6 archivos) | Handlers mock HTTP, temporales. |
| `assets/` | Recursos estáticos. |
| `scripts/` | Scripts de CI/CD. |
| `app/` (29 archivos) | Thin wrappers < 40 líneas. Su patrón se documenta en CONVENTIONS.md y ARCHITECTURE.md. |
| Stubs eliminados en Fase 1 (5 archivos) | Ya no existen. |

## Decisiones pendientes para el humano

Resueltas antes de comenzar la ejecución:

1. ~~**Unificación Post/UserPost**~~ → Sí, analizar antes de Fase 2 e incluir en Fase 1.
2. ~~**normalizeText() duplicado**~~ → Sí, migrar consumidores y eliminar en Fase 1.
3. ~~**Orden de Fase 2**~~ → Prioridad: auth → chat → feed → notifications → post → game → profile → explore → core.
4. ~~**TypeDoc HTML committear?**~~ → Sí, committear `docs/api/`.
5. ~~**Stubs y placeholders**~~ → Eliminar los 5 stubs, migrar consumidores al archivo real.
