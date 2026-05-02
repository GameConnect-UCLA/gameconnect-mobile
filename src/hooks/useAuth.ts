import { authApi, ApiError } from '@/src/api/auth.api'
import { secureStore } from '@/src/lib/secure-store'
import { useAuthStore } from '@/src/store/auth.store'
import { type AuthError, type LoginCredentials } from '@/src/types/auth.types'
import { User } from '../types/user.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const mapToAuthError = (e: unknown): AuthError => {
    if (e instanceof ApiError) {
        if (e.status === 401) return 'INVALID_CREDENTIALS'
        if (e.status >= 500) return 'SERVER_ERROR'
    }
    return 'NETWORK_ERROR'
}

export const ERROR_MESSAGES: Record<string, string> = {
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
    NETWORK_ERROR: 'Sin conexión, intenta de nuevo',
    SERVER_ERROR: 'Error del servidor, intenta más tarde',
}

export const useLogin = () => {
    const { setAuthenticated } = useAuthStore()
    const mutation = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            try {
                const { accessToken, refreshToken } = await authApi.login(credentials);
                await secureStore.save(secureStore.KEYS.ACCESS_TOKEN, accessToken);
                await secureStore.save(secureStore.KEYS.REFRESH_TOKEN, refreshToken);
                setAuthenticated(accessToken)

            } catch (error) {
                throw Error(ERROR_MESSAGES[mapToAuthError(error)])
            }
        }
        ,
        onError: () => {
            secureStore.clearAll();
        }
    })

    return mutation;
}

export const useRegister = () => {
    const { setAuthenticated } = useAuthStore()
    const mutation = useMutation({
        mutationFn: async (user: Partial<User>) => {
            try {
                const { accessToken, refreshToken } = await authApi.register(user)
                await secureStore.save(secureStore.KEYS.ACCESS_TOKEN, accessToken)
                await secureStore.save(secureStore.KEYS.REFRESH_TOKEN, refreshToken)
                setAuthenticated(accessToken)

            } catch (error) {
                throw Error(ERROR_MESSAGES[mapToAuthError(error)])
            }
        }

        ,
        onError: () => {
            secureStore.clearAll()
        }
    })

    return mutation;
}

export const useLogout = () => {
    const queryClient = useQueryClient(); 
    const { reset } = useAuthStore(); 
    const logout = async () => {
        await secureStore.clearAll(); 
        reset(); 
        queryClient.clear(); 
    }

    return { logout}
}
