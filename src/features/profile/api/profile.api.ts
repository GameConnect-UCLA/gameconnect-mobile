import { apiClient } from '@/src/core/api/client'
import type { User } from '@/src/core/types/user.types'

export interface UpdateProfilePayload {
  displayName?: string
  username?: string
  bio?: string
  pronouns?: string
  profilePic?: string
  coverPic?: string
  birthDate?: string  //  date string "YYYY-MM-DD"
}

export interface AccountSettings {
  notifications?: boolean
  privateAccount?: boolean
  showBirthDate?: boolean
  soundEnabled?: boolean
  soundType?: 'alegre' | 'suave' | 'clasico' | 'silencio'
  language?: 'es' | 'en'
}

export const getMe = async (): Promise<User> => {
  console.log("Entering getMe func")
  const { data } = await apiClient.get('/users/me')
  console.log("api response", data)
  return data
}

export const getUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get(`/users/${userId}`)
  return data
}

export const updateProfile = async (userId: string, payload: UpdateProfilePayload): Promise<User> => {
  if (!userId) {
    throw new Error('El ID de usuario es requerido para actualizar el perfil')
  }
  const { data } = await apiClient.patch(`/users/${userId}`, payload)
  return data
}

export const getSettings = async (): Promise<AccountSettings> => {
  const { data } = await apiClient.get<AccountSettings>('/users/me/settings')
  return data
}

export const updateSettings = async (payload: AccountSettings): Promise<AccountSettings> => {
  const { data } = await apiClient.patch<AccountSettings>('/users/me/settings', payload)
  return data
}

export const deleteAccount = async (userId?: string): Promise<void> => {
  await apiClient.delete(userId ? `/users/${userId}` : '/users/me')
}

export interface ToggleFollowResponse {
  following: boolean
  followersCount: number
  followingCount: number
}

export const toggleFollowUser = async (userId: string): Promise<ToggleFollowResponse> => {
  const { data } = await apiClient.post<ToggleFollowResponse>(`/users/${userId}/follow`)
  return data
}

export const getUserFavorites = async (userId: string, limit = 10, offset = 0) => {
  const { data } = await apiClient.get(`/users/${userId}/favorites`, { params: { limit, offset } })
  return data
}

export const getUserFollowers = async (userId: string, limit = 10, offset = 0): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>(`/users/${userId}/followers`, { params: { limit, offset } })
  return data
}

export const getUserFollowing = async (userId: string, limit = 10, offset = 0): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>(`/users/${userId}/following`, { params: { limit, offset } })
  return data
}

export const profileApi = {
  getMe,
  getUser,
  updateProfile,
  getSettings,
  updateSettings,
  deleteAccount,
  toggleFollowUser,
  getUserFavorites,
  getUserFollowers,
  getUserFollowing,
}


