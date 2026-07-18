import { mockRoutes } from './index'
import { mockNotifications } from '@/src/mocks/mock-notifications'

mockRoutes.set('/notifications', () => {
  return mockNotifications
})

mockRoutes.set('/notifications/follow-request/accept', (config) => {
  const { id } = JSON.parse(config.data || '{}')
  console.log(`MOCK: Accepted follow request: ${id}`)
  return { success: true }
})

mockRoutes.set('/notifications/follow-request/reject', (config) => {
  const { id } = JSON.parse(config.data || '{}')
  console.log(`MOCK: Rejected follow request: ${id}`)
  return { success: true }
})
