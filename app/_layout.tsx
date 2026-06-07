import AppToast from '@/src/core/components/AppToast';
import { ConfirmDialog } from '@/src/core/components/ConfirmDialog';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/core/lib/query-client';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <AppToast />
          <ConfirmDialog />
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
