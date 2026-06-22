import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { useToastStore } from "@/src/core/store/toast.store";

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["get-user", userId],
    queryFn: () => profileApi.getUser(userId),
    staleTime: 60_000,
    retry: 1,
  });
};
