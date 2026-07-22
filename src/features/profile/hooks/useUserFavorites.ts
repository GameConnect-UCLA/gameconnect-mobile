import { useQuery } from '@tanstack/react-query'
import { profileApi } from '../api/profile.api'

export const useUserFavorites = (userId: string) => {
  return useQuery({
    queryKey: ['userFavorites', userId],
    queryFn: () => profileApi.getUserFavorites(userId),
    enabled: !!userId,
  })
}
