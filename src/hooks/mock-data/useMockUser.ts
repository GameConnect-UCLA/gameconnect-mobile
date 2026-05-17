import { User } from '@/src/types/user.types';
import { mockUser } from './mock-user';

export const useMockUser = (): User => {
  return mockUser;  
};