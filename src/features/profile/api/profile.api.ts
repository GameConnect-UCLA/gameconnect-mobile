import { apiClient } from '@/src/core/api/client'
import { normalizeUser } from '@/src/core/api/user-normalizer'
import type { User } from '@/src/core/types/user.types'

export interface UpdateProfilePayload {
  displayName?: string
  username?: string
  bio?: string
  pronouns?: string
  profilePic?: string
  coverPic?: string
}

export const getProfile = async (): Promise<User> => {
  const { data } = await apiClient.get('/users/profile')
  return normalizeUser(data)
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<User> => {
  const { data } = await apiClient.patch('/users/profile', payload)
  return normalizeUser(data)
}

export const profileApi = { getProfile, updateProfile }
