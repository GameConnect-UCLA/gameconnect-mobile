/** Game profile hooks */
import { useQuery } from '@tanstack/react-query'
import { fetchGameProfiles, fetchGameProfileById } from '../api/game.api'
import type { FavoriteGame } from '@/src/core/types/user.types'

/** Hook to fetch all game profiles @returns Query result */
export const useGameProfiles = () => {
  return useQuery({
    queryKey: ['gameProfiles'],
    queryFn: fetchGameProfiles,
    staleTime: 60000,
  })
}

/** Hook to fetch a single game profile @param id Game ID @returns Query result */
export const useGameProfile = (id: string) => {
  return useQuery({
    queryKey: ['gameProfile', id],
    queryFn: () => fetchGameProfileById(id),
    staleTime: 60000,
    enabled: !!id,
  })
}

/** Hook returning mock favorite games @returns FavoriteGame array */
export const useMockGameProfile = (): FavoriteGame[] => {
  return []
}
