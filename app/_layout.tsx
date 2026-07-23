import { ActivityIndicator, View } from 'react-native'
import AppToast from '@/src/core/components/AppToast';
import { ConfirmDialog } from '@/src/core/components/ConfirmDialog';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/core/lib/query-client';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useAuthStore } from '@/src/core/store/auth.store'
import { useSessionCheck } from '@/src/features/auth/hooks'
import { LanguageProvider } from '@/src/core/context/LanguageContext';

function AuthNavigator() {
  const { isAuthenticated } = useAuthStore()
  const { isLoading } = useSessionCheck()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider>
            <AuthNavigator />
            <AppToast />
            <ConfirmDialog />
          </KeyboardProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

