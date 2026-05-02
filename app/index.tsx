import { Redirect } from 'expo-router'
import { useSessionCheck } from '@/src/hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/src/store/auth.store';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated); 
  const aToken = useAuthStore((s) => s.accessToken); 
  const { data, isLoading} = useSessionCheck();


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  console.log(isAuthenticated);
  console.log(aToken);
  console.log(data);
  
  
  
  
  return <Redirect href={data ? '/(tabs)' : '/(auth)/login'} />
}