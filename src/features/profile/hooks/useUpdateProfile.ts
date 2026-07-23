import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      return apiUser;
    },
    onSuccess: async () => {
      const fullUser = await profileApi.getMe();
      setUser(fullUser);
      await queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
    },
    onError: (e) => showToast(e.message, "error"),
  });

  return {
    updateProfile: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
