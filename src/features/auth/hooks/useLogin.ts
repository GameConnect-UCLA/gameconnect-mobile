/** Handles login mutation: sends credentials, persists tokens to secure-store, sets auth state. */
import { authApi } from "../api/auth.api";
import { secureStore } from "@/src/core/lib/secure-store";
import { useAuthStore } from "@/src/core/store/auth.store";
import { useUserStore } from "@/src/core/store/user.store";
import { type LoginCredentials } from "../types/auth.types";
import { useMutation } from "@tanstack/react-query";

/** Returns a mutation that logs in the user, persists JWT tokens, and sets auth store.
 * @returns A `useMutation` result with `mutate(credentials)`. On success, navigates to tabs.
 */
export const useLogin = () => {
  const { setAuthenticated } = useAuthStore();
  const { setUser } = useUserStore();
  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const { accessToken, refreshToken, user } =
        await authApi.login(credentials);
        await secureStore.save(secureStore.KEYS.ACCESS_TOKEN, accessToken);
        await secureStore.save(secureStore.KEYS.REFRESH_TOKEN, refreshToken);
        setAuthenticated(accessToken);
        setUser(user);
      } catch (error: any) {
        throw Error(error.message);
      }
    },
    onError: () => {
      secureStore.clearAll();
    },
  });

  return mutation;
};
