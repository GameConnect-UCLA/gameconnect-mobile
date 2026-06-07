/** Auth-related type definitions shared between API, hooks, and stores. */
import { User } from '@/src/core/types/user.types'

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthTokens = {
  access_token: string
  refresh_token: string
}

export type AuthResponse = AuthTokens & {
  user: User
}

export type SignUpInfo = {
  email: string, 
  username: string,
  password: string, 
  birth_date: string
}

export type AuthError =
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'SESSION_EXPIRED'
