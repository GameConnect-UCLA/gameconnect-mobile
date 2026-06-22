/** Auth-related type definitions shared between API, hooks, and stores. */
import { User } from "@/src/core/types/user.types";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = AuthTokens & {
  user: User;
};

export type SignUpInfo = {
  email: string;
  username: string;
  password: string;
  birthDate: string;
};

