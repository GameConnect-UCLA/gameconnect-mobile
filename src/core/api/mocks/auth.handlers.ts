import { mockRoutes } from './index'
import { mockUser } from '@/src/mocks/mock-user'

mockRoutes.set('/auth/login', (config) => {
  const { email, password } = JSON.parse(config.data || '{}')
  if (email !== mockUser.email || password !== 'password123') {
    throw { status: 401, message: 'Credenciales inválidas' }
  }
  return { access_token: 'mock-access-token', refresh_token: 'mock-refresh-token', user: mockUser }
})

mockRoutes.set('/auth/register', (config) => {
  const { username, email, birth_date } = JSON.parse(config.data || '{}')
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    user: { ...mockUser, username, email, birth_date },
  }
})

mockRoutes.set('/auth/refresh', (config) => {
  const { refresh_token } = JSON.parse(config.data || '{}')
  if (refresh_token !== 'mock-refresh-token') {
    throw { status: 401, message: 'Invalid refresh token' }
  }
  return { access_token: 'mock-access-token-refreshed', refresh_token: 'mock-refresh-token', user: mockUser }
})

mockRoutes.set('/auth/forgot-password', (config) => {
  const { email } = JSON.parse(config.data || '{}')
  if (!email) throw { status: 400, message: 'Email requerido' }
  return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' }
})

mockRoutes.set('/auth/reset-password', (config) => {
  const { password, confirm_password } = JSON.parse(config.data || '{}')
  if (password !== confirm_password) {
    throw { status: 400, message: 'Las contraseñas no coinciden' }
  }
  return { message: 'Contraseña actualizada correctamente.' }
})

mockRoutes.set('/auth/change-password', (config) => {
  const { current_password, new_password } = JSON.parse(config.data || '{}')
  if (current_password === new_password) {
    throw { status: 400, message: 'La nueva contraseña debe ser diferente a la actual' }
  }
  return { message: 'Contraseña cambiada correctamente.' }
})
