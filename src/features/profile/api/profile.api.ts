import { apiClient } from '@/src/core/api/client'
import type { User } from '@/src/core/types/user.types'

export interface UpdateProfilePayload {
  displayName?: string
  username?: string
  bio?: string
  pronouns?: string
  profilePic?: string
  coverPic?: string
}

export const getMe = async (): Promise<User> => {
  console.log("Entering getMe func")
  const { data } = await apiClient.get('/users/me')
  console.log("api response", data)
  return data
}

export const getUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get(`users/${userId}`)
  return data
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<User> => {
  const { data } = await apiClient.patch('/users/profile', payload)
  return data
}

export const profileApi = { getMe, getUser, updateProfile }
