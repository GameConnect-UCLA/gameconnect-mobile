# GameConnect Mobile

> [!NOTE]
> [Breve descripción del proyecto: qué es GameConnect, qué problema resuelve y a quién va dirigido]

App móvil **solo Android** para conectar jugadores de UCLA. Este proyecto usa Expo + React Native y está orientado a desarrollo interno.

---

## Tech Stack

| Tecnología | Versión | Para qué se usa |
|---|---|---|
| [Expo SDK](https://docs.expo.dev/) | 54 | Framework base del proyecto |
| [React Native](https://reactnative.dev/) | 0.81 | UI nativa |
| [Expo Router](https://docs.expo.dev/router/introduction/) | 6 | Navegación basada en archivos |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Tipado estático (modo estricto) |
| [React Query](https://tanstack.com/query/latest) | 5 | Gestión de estado del servidor y data fetching |
| [Socket.IO Client](https://socket.io/docs/v4/client-api/) | 4 | Comunicación en tiempo real |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | 4 | Animaciones de alto rendimiento |
| [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | 16 | Base de datos local (con soporte FTS) |
| [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/) | 15 | Almacenamiento seguro de credenciales |
| [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | 0.32 | Notificaciones push |

---

## Prerequisitos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** ≥ 18 — [Descargar](https://nodejs.org/)
- **npm** ≥ 9 — Viene con Node.js
- **Android Studio** — [Descargar](https://developer.android.com/studio)
  - Incluye el SDK de Android y el emulador
  - [Guía de configuración del emulador](https://docs.expo.dev/workflow/android-studio-emulator/)
- **EAS CLI** — Instalar con `npm install -g eas-cli`
  - [Documentación de EAS](https://docs.expo.dev/build/introduction/)

---

## Setup Inicial y Development Build

Este proyecto utiliza **Expo Development Builds**. A diferencia de *Expo Go*, esto nos permite incluir dependencias nativas personalizadas y tener un control total sobre el entorno de ejecución.

**Importante:** Una vez que instales el APK de desarrollo en tu emulador o dispositivo físico, **no es necesario volver a compilar o generar otro APK** mientras no se agreguen nuevas dependencias nativas de Android. Los cambios en el código de React Native se reflejan instantáneamente mediante el servidor de desarrollo.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd gameconnect-mobile
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Generar el proyecto nativo Android (Solo la primera vez)

```bash
npm run prebuild
```

> Esto genera la carpeta `android/` con el código nativo necesario. Solo es necesario ejecutarlo la primera vez o después de actualizar dependencias nativas.

### 4. Iniciar el servidor de desarrollo

```bash
npm run start
```

Esto abre la interfaz de Expo. Desde ahí puedes:

- Presionar **`a`** para abrir directamente en el emulador Android
- Escanear el QR con la app de desarrollo instalada en tu dispositivo.

---

## Flujo de Trabajo y Automatización (CI/CD)

Hemos automatizado el flujo de integración y despliegue continuo para facilitar el desarrollo y las pruebas:

### 1. Pull Requests a `dev` / `development`
Cada vez que se abre o actualiza un PR hacia la rama de desarrollo, se genera automáticamente un **EAS Update**.
- **¿Qué es EAS Update?** Es una actualización "Over-The-Air" (OTA) que envía solo los cambios en JavaScript y assets. Es casi instantáneo.
- **Diferencia con EAS Build:** Un *Build* genera un binario completo (.apk) y tarda ~15 min. Un *Update* actualiza la lógica de la app ya instalada en segundos.
- **Acceso:** Podrás probar los cambios del PR directamente escaneando el QR que aparecerá en un comentario automático antes de hacer el merge.

### 2. Merge a `dev`
Al hacer merge en la rama de desarrollo, se dispara un **EAS Build** para generar un nuevo **APK de desarrollo**. Esto asegura que siempre haya una versión instalable base actualizada con las últimas dependencias nativas.

### 3. Merge a `main`
Al hacer merge en la rama principal, se genera un **EAS Build** de tipo **Preview**. Este es un APK optimizado para pruebas finales antes de un lanzamiento.

### 4. Releases
Los builds de **Producción (Release)** se realizarán de forma **manual** por los responsables del proyecto para garantizar la estabilidad de las versiones oficiales.

---

## Workflow de Desarrollo Local

El flujo recomendado para trabajar localmente es:

```
1. Escribir código
       ↓
2. npm run start          → Ver cambios en el emulador (Fast Refresh)
       ↓
3. npm run lint           → Revisar errores de estilo
       ↓
4. npm run typecheck      → Verificar tipos de TypeScript
       ↓
5. Commit & push          → Dispara EAS Update en el PR
```

### Hot Reload

Expo recarga automáticamente los cambios en JavaScript/TypeScript. No necesitas reiniciar el servidor tras cada cambio. Solo necesitas reiniciar (`npm run start:clean`) si:

- Agregas o modificas dependencias nativas (requerirá nuevo `prebuild` o descargar nuevo APK de dev).
- Cambias la configuración de `app.json`.
- El hot reload deja de funcionar correctamente.

---

## Comandos Disponibles

Todos los comandos se ejecutan desde la carpeta `gameconnect-mobile/`.

### Desarrollo

| Comando | Descripción |
|---|---|
| `npm run start` | Inicia el servidor de desarrollo de Expo |
| `npm run start:clean` | Inicia el servidor limpiando la cache |
| `npm run android` | Ejecuta la app directamente en el emulador/dispositivo Android |

### Calidad de Código

| Comando | Descripción |
|---|---|
| `npm run lint` | Ejecuta ESLint con la configuración de Expo |
| `npm run typecheck` | Verifica errores de TypeScript sin generar archivos (`tsc --noEmit`) |

### Builds con EAS (CI/CD)

| Perfil | Trigger | Resultado |
|---|---|---|
| `EAS Update` | Pull Request a `dev` | Actualización JS accesible vía QR en comentario |
| `development` | Merge a `dev` | Genera nuevo APK de Desarrollo |
| `preview` | Merge a `main` | Genera nuevo APK de Preview (Release candidate) |
| `production` | Manual | Genera App Bundle final optimizado |

> **Nota:** El proyecto genera **APKs** para distribución interna. No está configurado para Play Store. 

### Actualizaciones OTA (Over-The-Air)

| Comando | Descripción |
|---|---|
| `npm run update:preview` | Envía actualización JS al canal `preview` |
| `npm run update:production` | Envía actualización JS al canal `production` |
| `npm run update:list` | Lista las actualizaciones publicadas |
| `npm run update:rollback` | Revive una actualización anterior |

> Las actualizaciones OTA solo aplican cambios en JavaScript/assets. Si modificaste código nativo o dependencias nativas, necesitas un build nuevo.

### Mantenimiento

| Comando | Descripción |
|---|---|
| `npm run clean` | Elimina `node_modules`, `.expo`, `dist` y cache de Gradle |
| `npm run clean:install` | Limpia y reinstala dependencias desde cero |
| `npm run reset-project` | Resetea la carpeta `app/` al starter vacío (mueve el código actual a `app-example`) |
| `npm run doctor` | Ejecuta `expo doctor` para diagnosticar problemas de configuración |

---

## Estructura del Proyecto

```
gameconnect-mobile/
├── app/                        # Rutas (Expo Router - file-based routing)
│   ├── _layout.tsx             # Layout raíz (ThemeProvider + Stack)
│   ├── (tabs)/                 # Grupo de rutas con bottom tabs
│   │   ├── _layout.tsx         # Layout de las tabs
│   │   ├── index.tsx           # Pantalla principal
│   │   └── explore.tsx         # Pantalla de exploración
│   └── modal.tsx               # Pantalla modal
│
├── components/                 # Componentes reutilizables
│   ├── themed-text.tsx         # Texto con soporte dark/light mode
│   ├── themed-view.tsx         # View con soporte dark/light mode
│   ├── parallax-scroll-view.tsx # ScrollView con efecto parallax
│   ├── external-link.tsx       # Link externo (abre navegador)
│   ├── haptic-tab.tsx          # Tab con feedback háptico
│   ├── hello-wave.tsx          # Animación de onda
│   └── ui/                     # Componentes UI genéricos
│       ├── collapsible.tsx
│       ├── icon-symbol.tsx
│       └── icon-symbol.ios.tsx
│
├── hooks/                      # Custom hooks
│   ├── use-color-scheme.ts     # Detecta tema del sistema
│   └── use-theme-color.ts      # Resuelve colores según tema
│
├── constants/                  # Constantes de la app
│   └── theme.ts                # Paleta de colores y tipografías
│
├── assets/                     # Imágenes, iconos, fuentes
│   └── images/
│
├── scripts/                    # Scripts de mantenimiento
│   └── reset-project.js
│
├── app.json                    # Configuración de Expo
├── eas.json                    # Configuración de EAS Build
├── tsconfig.json               # Configuración de TypeScript
├── eslint.config.js            # Configuración de ESLint
├── expo-env.d.ts               # Tipos de entorno Expo
│
├── .env.development            # Variables de entorno (desarrollo)
├── .env.preview                # Variables de entorno (preview)
└── .env.production             # Variables de entorno (producción)
```

---

## Arquitectura

### Navegación

El proyecto usa **Expo Router** con navegación basada en archivos:

- Cada archivo en `app/` es una ruta
- Los grupos entre paréntesis `(tabs)` no aparecen en la URL
- El layout `_layout.tsx` define la estructura de navegación padre

### Path Alias

Se usa `@/` como alias para importar desde la raíz del proyecto:

```typescript
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
```

### Theming

El sistema de temas soporta **modo claro y oscuro** automáticamente:

- Los colores se definen en `constants/theme.ts`
- Los hooks `useColorScheme` y `useThemeColor` resuelven el color correcto
- Los componentes `ThemedText` y `ThemedView` aplican colores automáticamente

### Data Fetching

Se usa **React Query** (`@tanstack/react-query`) para:

- Caché de datos del servidor
- Reintentos automáticos
- Estados de loading y error

### Comunicación en Tiempo Real

**Socket.IO** está disponible para funcionalidades en tiempo real como [completar según necesidades del proyecto].

### Base de Datos Local

**Expo SQLite** con soporte para FTS (Full Text Search) está configurado para almacenamiento local offline. En Android, FTS está deshabilitado por defecto para reducir el tamaño del build.

---

## Perfiles de Build

El archivo `eas.json` define tres perfiles:

| Perfil | Tipo | Distribución | Uso |
|---|---|---|---|
| `development` | APK debug | Interna | Desarrollo y pruebas locales |
| `preview` | APK release | Interna | Compartir con el equipo para testing |
| `production` | App Bundle | [Interna/Play Store] | Build optimizado para release |

> Todos los builds se ejecutan en la infraestructura cloud de EAS. Puedes ver el progreso con `npm run build:view`.

---

## Recursos Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [Tutorial de Expo Router](https://docs.expo.dev/router/introduction/)
- [Guía de Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Configurar emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Comunidad Expo en Discord](https://chat.expo.dev)
