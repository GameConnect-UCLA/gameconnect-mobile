import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { useToastStore } from "@/src/core/store/toast.store";
import { useAuthStore } from "@/src/core/store/auth.store";
import { useUserStore } from "@/src/core/store/user.store";
import { secureStore } from "@/src/core/lib/secure-store";

/** Hook para eliminar la cuenta del usuario autenticado */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const resetAuth = useAuthStore((s) => s.reset);
  const clearUser = useUserStore((s) => s.clearUser);

  return useMutation({
    mutationFn: (userId?: string) => profileApi.deleteAccount(userId),
    onSuccess: async () => {
      // Limpieza completa del estado de la app en cliente
      await secureStore.clearAll();
      resetAuth();
      clearUser();
      queryClient.clear();
      showToast("Tu cuenta ha sido eliminada correctamente", "success");
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message || "Error al eliminar la cuenta";
      showToast(msg, "error");
    },
  });
};
