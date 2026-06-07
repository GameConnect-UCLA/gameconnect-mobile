/** Frontend ↔ Backend API contracts for Auth module. */
/** Login credentials payload. */
export interface LoginRequest {
  email: string
  password: string
}

/** Registration payload with email, username, password, birth_date. */
export interface RegisterRequest {
  email: string
  username: string
  password: string
  birth_date: string
}

/** Refresh token payload. */
export interface RefreshTokenRequest {
  refresh_token: string
}

/** Tokens + user returned after login/register. */
export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: AuthUserResponse
}

/** Full authenticated user profile. */
export interface AuthUserResponse {
  id: string
  display_name: string
  username: string
  role: string
  email: string
  bio?: string
  pronouns?: string
  birth_date?: string
  account_settings: Record<string, unknown>
  profile_pic: string
  cover_pic: string
  state: string
  banned_at?: string | null
  ban_reason?: string | null
  created_at: string
  deleted_at?: string | null
  verified?: boolean
}

/** Forgot-password email-only payload. */
export interface ForgotPasswordRequest {
  email: string
}

/** Reset-password payload with new password + confirmation. */
export interface ResetPasswordRequest {
  password: string
  confirm_password: string
}

/** Change-password payload with current + new password. */
export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

/** Generic message-only response. */
export interface MessageResponse {
  message: string
}
