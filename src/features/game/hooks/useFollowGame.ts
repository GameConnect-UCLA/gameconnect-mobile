import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleFollowGame, ToggleFollowGameResponse } from '../api/game.api'
import { useToastStore } from '@/src/core/store/toast.store'

export const useFollowGame = () => {
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.showToast)

  return useMutation({
    mutationFn: (gameId: string) => toggleFollowGame(gameId),
    onSuccess: (data: ToggleFollowGameResponse, gameId: string) => {
      queryClient.invalidateQueries({ queryKey: ['gameProfile', gameId] })
      queryClient.invalidateQueries({ queryKey: ['gameProfiles'] })

      const message = data.following
        ? 'Ahora sigues este juego'
        : 'Has dejado de seguir este juego'
      showToast(message, 'success')
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message || 'Error al cambiar estado de seguimiento del juego'
      showToast(msg, 'error')
    },
  })
}
