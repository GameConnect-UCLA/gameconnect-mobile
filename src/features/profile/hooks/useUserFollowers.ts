import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';

export const useUserFollowers = (userId: string, limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['followers', userId, limit, offset],
    queryFn: () => profileApi.getUserFollowers(userId, limit, offset),
    enabled: !!userId,
  });
};