import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';

export const useUserFollowing = (userId: string, limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['following', userId, limit, offset],
    queryFn: () => profileApi.getUserFollowing(userId, limit, offset),
    enabled: !!userId,
  });
};