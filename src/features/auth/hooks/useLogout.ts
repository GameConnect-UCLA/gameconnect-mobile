/** Hook to logout user, clean auth state and secure store. */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/src/core/store/auth.store'
import { useToastStore } from '@/src/core/store/toast.store'
import { secureStore } from '@/src/core/lib/secure-store'
import { authApi } from '../api/auth.api'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const authReset = useAuthStore((s) => s.reset)
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await secureStore.get(secureStore.KEYS.REFRESH_TOKEN)
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Error al cerrar sesión'
      showToast(msg, 'error')
    },
    onSettled: async () => {
      await secureStore.clearAll()
      authReset()
      queryClient.clear()
    },
    onSuccess: () => {
      showToast('Sesión cerrada', 'success')
    },
  })
}
