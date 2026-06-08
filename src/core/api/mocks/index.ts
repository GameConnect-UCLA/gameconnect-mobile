import type { AxiosInstance, AxiosRequestConfig } from 'axios'

type MockHandler = (config: AxiosRequestConfig) => unknown | Promise<unknown>

export const mockRoutes = new Map<string, MockHandler>()

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms))
}

export function setupMocks(instance: AxiosInstance, baseURL: string) {
  instance.interceptors.request.use(async (config) => {
    const url = (config.url ?? '').replace(baseURL, '')
    let handler = mockRoutes.get(url)
    if (!handler) {
      for (const [route, h] of mockRoutes.entries()) {
        if (url.startsWith(route) && route.endsWith('/')) {
          handler = h
          break
        }
      }
    }
    if (!handler) return config

    await delay(200 + Math.random() * 400)

    try {
      const data = await handler(config)
      config.adapter = async () => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
      })
    } catch (err) {
      const apiError = err as { status?: number; message?: string }
      config.adapter = async () => ({
        data: { message: apiError.message || 'Mock error' },
        status: apiError.status || 500,
        statusText: 'Error',
        headers: { 'content-type': 'application/json' },
        config,
      })
    }

    return config
  })
}
