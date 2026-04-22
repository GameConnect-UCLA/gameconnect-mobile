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

## Instalación y setup

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

Para generar un APK de desarrollo con EAS:

```bash
eas build --profile development --platform android
```

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores. Nunca subas `.env` al repositorio.

```env
# URL base del backend (sin slash al final)
EXPO_PUBLIC_API_URL=http://localhost:3000

# URL del servidor de WebSockets
EXPO_PUBLIC_WS_URL=http://localhost:3000
```

Todas las variables del cliente deben tener el prefijo `EXPO_PUBLIC_` para ser accesibles desde la app. Las variables sin ese prefijo solo están disponibles en tiempo de build.

---

## Estructura del proyecto

```
gameconnect-mobile/
├── app/          # Rutas de navegación (Expo Router). Solo rutas, sin lógica.
├── src/
│   ├── api/      # Funciones de comunicación con el backend.
│   ├── store/    # Estado global de la app (Zustand).
│   ├── hooks/    # Lógica React reutilizable y queries (TanStack Query).
│   ├── components/ # Componentes visuales reutilizables.
│   ├── lib/      # Configuración de librerías externas.
│   └── types/    # Interfaces y tipos TypeScript globales.
├── assets/       # Imágenes, íconos y fuentes estáticas.
└── constants/    # Constantes globales (theme, config).
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
