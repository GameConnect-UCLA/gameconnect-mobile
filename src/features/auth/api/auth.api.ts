/** Functions to call auth backend endpoints. Each maps 1:1 to a REST route. */
import { apiClient } from '@/src/core/api/client'
import { ApiError } from '@/src/core/api/ApiError'
import type { AuthResponse, LoginCredentials, SignUpInfo } from '../types/auth.types'

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
  return data
}

const register = async (newUser: SignUpInfo): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', newUser)
  return data
}

const refresh = async (token: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refresh_token: token })
  return data
}

const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', { email })
  return data
}

const resetPassword = async (payload: { password: string; confirmPassword: string }): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>('/auth/reset-password', payload)
  return data
}

const changePassword = async (payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>('/auth/change-password', payload)
  return data
}

export { ApiError }
export const authApi = { login, register, refresh, forgotPassword, resetPassword, changePassword }
