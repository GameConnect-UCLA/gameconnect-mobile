/** Functions to call auth backend endpoints. Each maps 1:1 to a REST route. */
import { apiClient } from "@/src/core/api/client";
import type {
  AuthResponse,
  LoginCredentials,
  SignUpInfo,
} from "../types/auth.types";
import axios from "axios";

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/login", credentials);
  console.info("Login data:", data);
  return data;
};

const register = async (newUser: SignUpInfo): Promise<AuthResponse> => {
  const res = await apiClient.post("/register", newUser);
  return res.data;
};

const refresh = async (token: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/refresh", {
    refreshToken: token,
  });
  return data;
};

const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/forgot-password", { email });
  return data;
};

const resetPassword = async (payload: {
  email: string;
  code: string;
  newPassword: string;
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

const verifyRecoveryCode = async (code: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post("/verify-recovery-code", { code });
  return data;
};

export const authApi = {
  login,
  register,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyRecoveryCode,
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/logout', { refreshToken })
  },
};
