import { User, UserRole, UserState } from '../../types/user.types';

export const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  display_name: 'Adrián Perez',
  username: 'douriann',
  role: UserRole.USER,
  email: 'adrian@example.com',
  bio: 'Hola tengo hambre.',
  account_settings: { theme: 'dark', notifications: true },
  profile_pic: 'https://i.pravatar.cc/150?u=adrian',
  state: UserState.ACTIVE,
  created_at: new Date().toISOString(),
};