import * as SecureStore from 'expo-secure-store'

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const

type StoreKey = (typeof KEYS)[keyof typeof KEYS]

const save = async (key: StoreKey, value: string): Promise<void> => {
  await SecureStore.setItemAsync(key, value)
}

const get = async (key: StoreKey): Promise<string | null> => {
  return SecureStore.getItemAsync(key)
}

const remove = async (key: StoreKey): Promise<void> => {
  await SecureStore.deleteItemAsync(key)
}

const clearAll = async (): Promise<void> => {
  await Promise.all(Object.values(KEYS).map(remove))
}

export const secureStore = { save, get, remove, clearAll, KEYS }