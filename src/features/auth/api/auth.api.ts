/** Functions to call auth backend endpoints. Each maps 1:1 to a REST route. */
import { apiClient } from "@/src/core/api/client";
import type {
  AuthResponse,
  LoginCredentials,
  SignUpInfo,
} from "../types/auth.types";

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log("Entrando en login");
  const { data } = await apiClient.post("/login", credentials);
  return data;
};

const register = async (newUser: SignUpInfo): Promise<AuthResponse> => {
  const payload = {
    email: newUser.email,
    password: newUser.password,
    username: newUser.username,
    birthDate: newUser.birth_date ?? null,
  };
  const { data } = await apiClient.post("/register", payload);
  return data;
};

const refresh = async (token: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/refresh", {
    refresh_token: token,
  });
  return data;
};

const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/forgot-password", { email });
  return data;
};

const resetPassword = async (payload: {
  password: string;
  confirmPassword: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/reset-password", payload);
  return data;
};

const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/change-password", payload);
  return data;
};

export const authApi = {
  login,
  register,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
};
