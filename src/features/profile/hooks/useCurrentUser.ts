import { useQuery } from '@tanstack/react-query'
import { profileApi } from '../api/profile.api'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: profileApi.getProfile,
    staleTime: 60_000,
    retry: 1,
  })
}
