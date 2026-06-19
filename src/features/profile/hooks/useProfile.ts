import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, UpdateProfilePayload } from "../api/profile.api";
import { useUserStore } from "@/src/core/store/user.store";
import { useToastStore } from "@/src/core/store/toast.store";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const showToast = useToastStore((s) => s.showToast);
  const mutation = useMutation({
    mutationFn: async (profileData: UpdateProfilePayload) => {
      const apiUser = await profileApi.updateProfile(profileData);
      return apiUser;
    },
    onSuccess: async (apiUser) => {
      setUser(apiUser);
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (e) => showToast(e.message, "error"),
  });

  return {
    updateProfile: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
