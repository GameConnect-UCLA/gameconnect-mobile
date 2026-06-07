# GameConnect Mobile

Red social móvil especializada en el ecosistema de videojuegos. Permite a jugadores conectarse, descubrir títulos, compartir publicaciones y chatear en tiempo real.

Proyecto académico — Laboratorio III, Universidad Centroccidental "Lisandro Alvarado".

---

## Stack

| Capa | Tecnología |
|---|---|
| Cliente móvil | React Native + Expo (SDK 54) |
| Routing | Expo Router |
| Estado global | Zustand |
| Server state / caché | TanStack Query v5 |
| Autenticación | JWT + Refresh Token (expo-secure-store) |
| Tiempo real | Socket.io-client |
| Notificaciones push | Expo FCM (Firebase Cloud Messaging) |
| Animaciones | React Native Reanimated 4 |
| Backend | NestJS (repositorio separado) |

---

## Prerequisitos

Antes de correr el proyecto asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- [EAS CLI](https://docs.expo.dev/eas/) — `npm install -g eas-cli` (para builds en la nube)
- Es necesario compilar un development build (APK de desarrollo) e instalarlo en el dispositivo de pruebas, o en su defecto configurar un emulador con el android sdk. 
- El backend de GameConnect corriendo localmente o en un servidor accesible

---

## Setup Inicial y Development Build

Este proyecto utiliza **Expo Development Builds**. A diferencia de *Expo Go*, esto nos permite incluir dependencias nativas personalizadas y tener un control total sobre el entorno de ejecución.

**Importante:** Una vez que instales el APK de desarrollo en tu emulador o dispositivo físico, **no es necesario volver a compilar o generar otro APK** mientras no se agreguen nuevas dependencias nativas de Android. Los cambios en el código de React Native se reflejan instantáneamente mediante el servidor de desarrollo.

### 1. Clonar el repositorio

```bash
# 1. Clonar el repositorio
git clone https://github.com/[org]/gameconnect-mobile.git
cd gameconnect-mobile

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores (ver sección siguiente)

# 4. Correr en modo desarrollo
npx expo start

# Para correr específicamente en Android
npx expo start --android
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

La automatización del proyecto está diseñada para **conservar el cuota gratuito de EAS Build** (30 builds/mes). Los builds se generan únicamente de forma manual o local, nunca automáticamente.

### 1. Pull Requests a `dev`
Cada vez que se abre o actualiza un PR hacia `dev`, se genera automáticamente un **EAS Update** (actualización OTA) siempre que los cambios sean solo en JavaScript/assets.
- **¿Qué es EAS Update?** Es una actualización "Over-The-Air" que envía solo los cambios en JavaScript y assets. Es casi instantáneo.
- **Diferencia con EAS Build:** Un *Build* genera un binario completo (.apk) y consume cuota de EAS. Un *Update* actualiza la app ya instalada en segundos y **no consume cuota**.
- **Acceso:** Escanea el QR que aparece en un comentario automático del PR para probar los cambios en tu **Development Build** antes de hacer merge.

### 2. Cambios nativos en PRs
Si un PR incluye cambios en archivos nativos (`android/`, `package.json`, `app.json`, etc.), el bot agregará un comentario de advertencia indicando que será necesario generar un nuevo Development Build después del merge.

> **No se genera ningún build automático.** Esto es intencional para conservar el cuota de EAS Build.

### 3. Builds — Estrictamente manuales
Los builds se generan únicamente cuando los desarrolladores lo necesiten, de dos formas:

| Método | Comando | Cuota EAS |
|---|---|---|
| **Cloud (EAS)** | `npm run build:dev` | Sí consume |
| **Local** | `eas build --profile development --platform android --local` | No consume |

> **Recomendación:** Usa builds locales siempre que sea posible. Solo usa builds en la nube cuando necesites compartir el APK con alguien que no puede compilar localmente.

### 4. Releases
Los builds de **Producción (Release)** se realizan de forma **manual** por los responsables del proyecto.

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
5. Commit & push → Abrir PR a `dev` → EAS Update automático (si solo JS)
       ↓
6. Si hubo cambios nativos → npm run build:dev (o --local)
```

### ¿Cuándo necesitas un nuevo Development Build?

Solo necesitas generar un nuevo APK de desarrollo si:

- Agregas o modificas **dependencias nativas** (cambios en `package.json` + `package-lock.json`)
- Cambias la configuración de `app.json`
- Modificas código en `android/`
- El hot reload deja de funcionar correctamente.

En cualquier otro caso (cambios en JS/TS, componentes, hooks, assets, etc.), **un EAS Update es suficiente** y no necesitas un nuevo build.

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

### Builds con EAS

| Perfil | Comando | Uso |
|---|---|---|
| `development` | `npm run build:dev` | Genera APK de desarrollo (dev client) |
| `preview` | `npm run build:preview` | Genera APK de preview para compartir con el equipo |
| `production` | `npm run build:production` | Genera App Bundle final optimizado |

> **Nota:** Ningún build se genera automáticamente. Todos los builds son manuales o locales para conservar el cuota de EAS.

### Actualizaciones OTA (Over-The-Air)

| Comando | Descripción |
|---|---|
| `npm run update:preview` | Envía actualización JS al canal `preview` |
| `npm run update:production` | Envía actualización JS al canal `production` |
| `npm run update:list` | Lista las actualizaciones publicadas |
| `npm run update:rollback` | Revive una actualización anterior |

> Las actualizaciones OTA no consumen cuota de EAS Build y son el método preferido para desplegar cambios en JavaScript/assets.

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
├── app/          # Rutas de navegación (Expo Router). Thin wrappers < 40 líneas.
├── src/
│   ├── core/     # Infraestructura compartida (theme, components, hooks, store, types, i18n, lib)
│   ├── features/ # Módulos de negocio autocontenidos (auth, chat, feed, game, etc.)
│   ├── mocks/    # Datos mock para desarrollo
│   └── types/    # Interfaces y tipos TypeScript globales (legacy, re-exportados desde features/)
├── assets/       # Imágenes, íconos y fuentes estáticas.
├── docs/         # Documentación del proyecto
└── scripts/      # Automatización de desarrollo
```

Para más detalle sobre convenciones de código, nomenclatura, estructura de rutas y flujo de Git, ver [CONVENTIONS.md](./CONVENTIONS.md).

---

## Links útiles

| Recurso | Link |
|---|---|
| Prototipo Figma | [Ver prototipo](https://www.figma.com/design/JYdiHOGm0ENknYF7M3ASWV/Videojuego?node-id=0-1) |
| Spec doc | [Ver documento](./docs/Spec_Doc_Lab3.pdf) |
| Diagrama de arquitectura | [Ver en Excalidraw](https://excalidraw.com) |
| Diagrama MER | [Ver en dbdiagram.io](https://dbdiagram.io) |
<!-- | Repositorio backend | [gameconnect-api](https://github.com/[org]/gameconnect-api) | -->

---

## Equipo

| Nombre | GitHub |
|---|---|
| Adrián Pereira | [@usuario](https://github.com) |
| Dehucarlys Azuaje | [@usuario](https://github.com) |
| Edgar López | [@usuario](https://github.com) |
| Hanuman Sanchez | [@usuario](https://github.com) |
| José Alvarado | [@usuario](https://github.com) |

Asignatura: Laboratorio III — Prof. Jorge Chiquín
