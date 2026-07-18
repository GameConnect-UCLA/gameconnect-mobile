/** Handles signup mutation: registers user, persists tokens, sets auth state. */
import { authApi } from "../api/auth.api";
import { secureStore } from "@/src/core/lib/secure-store";
import { useAuthStore } from "@/src/core/store/auth.store";
import { useUserStore } from "@/src/core/store/user.store";
import { type SignUpInfo } from "../types/auth.types";
import { useMutation } from "@tanstack/react-query";

/** Registers a new user. On success, persists tokens and sets auth + user stores.
 * @returns A `useMutation` result with `mutate(signUpInfo)`.
 */
export const useSignup = () => {
  const { setAuthenticated } = useAuthStore();
  const { setUser } = useUserStore();
  const mutation = useMutation({
    mutationFn: async (userData: SignUpInfo) => {
      try {
        const { accessToken, refreshToken, user } = await authApi.register(userData);
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
