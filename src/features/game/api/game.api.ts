/** Game API functions */
import { apiClient } from '@/src/core/api/client'
import type { GameProfile } from '../types/game.types'

/** Fetch all game profiles @returns GameProfile list */
export const fetchGameProfiles = async (): Promise<GameProfile[]> => {
  const { data } = await apiClient.get<GameProfile[]>('/games')
  return data
}

/** Fetch game profile by ID @param id Game ID @returns GameProfile or undefined */
export const fetchGameProfileById = async (id: string): Promise<GameProfile | undefined> => {
  const { data } = await apiClient.get<GameProfile | undefined>(`/games/${id}`)
  return data
}

/** Search game profiles by query @param query Search string @returns Matching GameProfile list */
export async function searchGameProfiles(query: string): Promise<GameProfile[]> {
  const { data } = await apiClient.get<GameProfile[]>('/games/search', { params: { q: query } })
  return data
}

export interface ToggleFollowGameResponse {
  following: boolean
  followersCount: number
}

/** Toggle follow/unfollow a game @param gameId Game ID @returns Toggle response */
export const toggleFollowGame = async (gameId: string): Promise<ToggleFollowGameResponse> => {
  const { data } = await apiClient.post<ToggleFollowGameResponse>(`/games/${gameId}/follow`)
  return data
}

