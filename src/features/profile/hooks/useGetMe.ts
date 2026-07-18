import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";

export const useGetMe = () => {
  return useQuery({
    queryKey: ["get-me"],
    queryFn: profileApi.getMe,
    retry: 1,
  });
};
