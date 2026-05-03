import type { AuthResponse, LoginCredentials } from '@/src/types/auth.types'
import { mockUser } from '@/src/hooks/mock-data/mock-user'
import { User } from '../types/user.types'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

const simulateLatency = () => new Promise((res) => setTimeout(res, 800))

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await simulateLatency()

  if (credentials.email !== mockUser.email || credentials.password !== 'password123') {
    throw new ApiError(401, 'Invalid credentials')
  }

  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
  }
}

const register = async (user: Partial<User>): Promise<AuthResponse> => {
  await simulateLatency()

  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
  }
}

const refresh = async (token: string): Promise<AuthResponse> => {
  await simulateLatency()

  if (token !== 'mock-refresh-token') {
    throw new ApiError(401, 'Invalid refresh token')
  }

  return {
    accessToken: 'mock-access-token-refreshed',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
  }
}

export const authApi = { login, register, refresh }