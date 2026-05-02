import { User } from "./user.types"

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type AuthResponse = AuthTokens & {
  user: User
}

export type SignUpInfo = {
  email: string, 
  username: string,
  password: string, 
  birthDate: string
}

export type AuthError =
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'SESSION_EXPIRED'