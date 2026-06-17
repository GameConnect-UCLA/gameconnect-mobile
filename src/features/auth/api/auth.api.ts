/** Functions to call auth backend endpoints. Each maps 1:1 to a REST route. */
import { apiClient } from '@/src/core/api/client'
import { normalizeUser } from '@/src/core/api/user-normalizer'
import { ApiError } from '@/src/core/api/ApiError'
import type { AuthResponse, LoginCredentials, SignUpInfo } from '../types/auth.types'
import type { User } from '@/src/core/types/user.types'

function normalizeAuthResponse(data: Record<string, unknown>): AuthResponse {
  return {
    access_token: (data.accessToken ?? data.access_token) as string,
    refresh_token: (data.refreshToken ?? data.refresh_token) as string,
    user: normalizeUser((data.user ?? data) as Record<string, unknown>),
  }
}

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/login', credentials)
  return normalizeAuthResponse(data)
}

const register = async (newUser: SignUpInfo): Promise<AuthResponse> => {
  const payload: Record<string, unknown> = {
    email: newUser.email,
    password: newUser.password,
    username: newUser.username,
  }
  if (newUser.birth_date) {
    payload.birthDate = newUser.birth_date
  }
  const { data } = await apiClient.post('/auth/register', payload)
  return normalizeAuthResponse(data)
}

const refresh = async (token: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/refresh', { refresh_token: token })
  return normalizeAuthResponse(data)
}

const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post('/auth/forgot-password', { email })
  return data
}

const resetPassword = async (payload: { password: string; confirmPassword: string }): Promise<{ message: string }> => {
  const { data } = await apiClient.post('/auth/reset-password', payload)
  return data
}

const changePassword = async (payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  const { data } = await apiClient.post('/auth/change-password', payload)
  return data
}

export { ApiError }
export const authApi = { login, register, refresh, forgotPassword, resetPassword, changePassword }
