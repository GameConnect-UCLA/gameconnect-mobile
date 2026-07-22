import { useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi, ToggleFollowResponse } from '../api/profile.api'
import { useToastStore } from '@/src/core/store/toast.store'
import { useUserStore } from '@/src/core/store/user.store'

export const useFollowUser = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)
  const user = useUserStore((s) => s.user) // Obtener el usuario autenticado

  return useMutation({
    mutationFn: (userId: string) => profileApi.toggleFollowUser(userId),
    onSuccess: (data: ToggleFollowResponse, targetUserId: string) => {
      // Invalidar perfil del usuario al que seguimos/dejamos de seguir
      queryClient.invalidateQueries({ queryKey: ['userProfile', targetUserId] })
      // Invalidar el perfil del usuario autenticado (si existe)
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] })
      }
      // También invalidar 'users/me'
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] })

      // Invalidar listas de seguidores y siguiendo para el objetivo y el usuario autenticado
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] })
      queryClient.invalidateQueries({ queryKey: ['following', targetUserId] })
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['followers', user.id] })
        queryClient.invalidateQueries({ queryKey: ['following', user.id] })
      }

      const message = data.following
        ? 'Ahora sigues a este usuario'
        : 'Has dejado de seguir a este usuario'
      showToast(message, 'success')
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message || 'Error al cambiar estado de seguimiento'
      showToast(msg, 'error')
    },
  })
}
