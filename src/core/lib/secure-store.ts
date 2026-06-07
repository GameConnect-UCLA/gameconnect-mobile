/** Secure storage wrapper around expo-secure-store. */
import * as SecureStore from 'expo-secure-store'

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const

type StoreKey = (typeof KEYS)[keyof typeof KEYS]

/** Save a value to secure storage. @param key Storage key. @param value String value. */
const save = async (key: StoreKey, value: string): Promise<void> => {
  await SecureStore.setItemAsync(key, value)
}

/** Retrieve a value from secure storage. @param key Storage key. @returns Stored string or null. */
const get = async (key: StoreKey): Promise<string | null> => {
  return SecureStore.getItemAsync(key)
}

/** Remove a value from secure storage. @param key Storage key. */
const remove = async (key: StoreKey): Promise<void> => {
  await SecureStore.deleteItemAsync(key)
}

/** Clear all known keys from secure storage. */
const clearAll = async (): Promise<void> => {
  await Promise.all(Object.values(KEYS).map(remove))
}

/** Secure storage wrapper with save/get/remove/clearAll methods and predefined KEYS. */
export const secureStore = { save, get, remove, clearAll, KEYS }
