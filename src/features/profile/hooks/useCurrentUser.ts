/** Current user hook (temporary mock) */
import type { User } from '@/src/core/types/user.types'
import { mockUser } from '@/src/mocks/mock-user'

/** Hook returning mock user data (temp until backend) @returns User */
export const useMockUser = (): User => {
  return mockUser
}
