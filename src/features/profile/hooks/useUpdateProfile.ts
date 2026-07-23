import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi, UpdateProfilePayload } from "../api/profile.api";
import { useUserStore } from "@/src/core/store/user.store";
import { useToastStore } from "@/src/core/store/toast.store";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useUserStore();
  const showToast = useToastStore((s) => s.showToast);
  const mutation = useMutation({
    mutationFn: async (profileData: UpdateProfilePayload) => {
      if (!user?.id) {
        throw new Error("No se encontró una sesión de usuario activa");
      }
      const apiUser = await profileApi.updateProfile(user.id, profileData);
      const { setUser } = useUserStore.getState();
      setUser(apiUser);
      return apiUser;
    },
    onSuccess: async (apiUser) => {
      setUser(apiUser);
      await queryClient.invalidateQueries({ queryKey: ["update-profile"] });
    },
    onError: (e) => showToast(e.message, "error"),
  });

  return {
    updateProfile: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
