/** Hook to logout user, clean auth state and secure store. */

import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useToastStore } from '@/src/core/store/toast.store'
import { secureStore } from '@/src/core/lib/secure-store'
import { handleLogout } from '@/src/core/api/client'
import { authApi } from '../api/auth.api'

export const useLogout = () => {
  const showToast = useToastStore((s) => s.showToast)

  const performLogout = () => {
    handleLogout('Sesión cerrada')
  }

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await secureStore.get(secureStore.KEYS.REFRESH_TOKEN)
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    },
    onError: async (error: AxiosError<{ message?: string }>) => {
      const msg = error?.response?.data?.message || 'Error al cerrar sesión'
      showToast(msg, 'error')
      performLogout()
    },
    onSuccess: () => {
      showToast('Sesión cerrada', 'success')
      performLogout()
    },
  })
}
