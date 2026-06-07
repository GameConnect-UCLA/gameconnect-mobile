import { Redirect } from 'expo-router'
import { useSessionCheck } from '@/src/features/auth/hooks';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { data, isLoading } = useSessionCheck();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Redirect href={data ? '/(tabs)' : '/(auth)/login'} />
}