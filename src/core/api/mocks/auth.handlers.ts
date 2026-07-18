import { mockRoutes } from './index'
import { mockUser } from '@/src/mocks/mock-user'

function parseBody(config: { data?: unknown }) {
  const raw = config.data || '{}'
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

mockRoutes.set('/auth/login', (config) => {
  const { email, password } = parseBody(config)
  if (!email || !password) {
    throw { status: 401, message: 'Credenciales inválidas' }
  }
  return { access_token: 'mock-access-token', refresh_token: 'mock-refresh-token', user: { ...mockUser, email } }
})

mockRoutes.set('/auth/register', (config) => {
  const { username, email, birthDate } = parseBody(config)
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    user: { ...mockUser, username, email, birthDate },
  }
})

mockRoutes.set('/auth/refresh', (config) => {
  const { refresh_token } = parseBody(config)
  if (refresh_token !== 'mock-refresh-token') {
    throw { status: 401, message: 'Invalid refresh token' }
  }
  return { access_token: 'mock-access-token-refreshed', refresh_token: 'mock-refresh-token', user: mockUser }
})

mockRoutes.set('/auth/forgot-password', (config) => {
  const { email } = parseBody(config)
  if (!email) throw { status: 400, message: 'Email requerido' }
  return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' }
})

mockRoutes.set('/auth/reset-password', (config) => {
  const { password, confirm_password } = parseBody(config)
  if (password !== confirm_password) {
    throw { status: 400, message: 'Las contraseñas no coinciden' }
  }
  return { message: 'Contraseña actualizada correctamente.' }
})

mockRoutes.set('/auth/change-password', (config) => {
  const { current_password, new_password } = parseBody(config)
  if (current_password === new_password) {
    throw { status: 400, message: 'La nueva contraseña debe ser diferente a la actual' }
  }
  return { message: 'Contraseña cambiada correctamente.' }
})
