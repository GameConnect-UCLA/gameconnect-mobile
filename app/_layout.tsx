import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

// 1. Creamos el cliente que manejará los datos (evita el error que te salió)
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // 2. Envolvemos toda la app con el proveedor
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Aquí definimos las rutas principales */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="user/edit-profile" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}