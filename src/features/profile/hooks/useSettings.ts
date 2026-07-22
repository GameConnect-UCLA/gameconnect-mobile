import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi, type AccountSettings } from "../api/profile.api";
import { useToastStore } from "@/src/core/store/toast.store";

/** Hook para obtener la configuración del usuario autenticado */
export const useSettings = () => {
  return useQuery({
    queryKey: ["account-settings"],
    queryFn: profileApi.getSettings,
  });
};

/** Hook para actualizar parcialmente la configuración del usuario autenticado */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  return useMutation({
    mutationFn: profileApi.updateSettings,
    onSuccess: (data) => {
      // Actualiza la caché inmediatamente con la respuesta del servidor
      queryClient.setQueryData(["account-settings"], data);
      showToast("Configuración actualizada con éxito", "success");
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message || "Error al actualizar la configuración";
      showToast(msg, "error");
    },
  });
};
