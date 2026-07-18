import { mockRoutes } from './index'
import { mockUser } from '@/src/mocks/mock-user'

mockRoutes.set('/users/profile', () => mockUser)
