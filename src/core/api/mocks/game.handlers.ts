import { mockRoutes } from './index'
import { mockGameProfiles } from '@/src/mocks/mock-game'

mockRoutes.set('/games', () => {
  return mockGameProfiles
})

mockRoutes.set('/games/', (config) => {
  const id = config.url?.replace('/games/', '')
  if (!id) return mockGameProfiles
  const game = mockGameProfiles.find((g) => g.id === id)
  if (!game) throw { status: 404, message: 'Game not found' }
  return game
})

mockRoutes.set('/games/search', (config) => {
  const query = config.params?.q ?? ''
  if (!query.trim()) return []
  const lower = query.toLowerCase()
  return mockGameProfiles.filter((g) => g.title.toLowerCase().includes(lower))
})
