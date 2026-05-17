import AppToast from '@/src/components/ui/app-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';


const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        <AppToast />
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
