import { Redirect } from 'expo-router'
import { useAuthStore } from '@/src/store/auth.store'
import { secureStore } from "@/src/lib/secure-store"
import { useEffect } from 'react';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { setAuthenticated } = useAuthStore(); 

  useEffect(() => {

    const checkRefreshToken = async () => {
    
    if (isAuthenticated) return; 
    const refreshToken = await secureStore.get(secureStore.KEYS.REFRESH_TOKEN)
    // alert(refreshToken)
    if (refreshToken) setAuthenticated(refreshToken); 
  }

  checkRefreshToken();

  }, [])

  
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />
}