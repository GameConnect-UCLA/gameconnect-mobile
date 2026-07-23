/** Utility functions for extracting human-readable error messages from API and network errors */

export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'Ha ocurrido un error inesperado.'
): string {
  if (!error) return fallbackMessage;

  const responseData = (error as any)?.response?.data;

  if (responseData) {
    // 1. Array of validation strings (from NestJS ValidationPipe)
    if (Array.isArray(responseData.message) && responseData.message.length > 0) {
      return responseData.message.join('. ');
    }

    // 2. Structured string message or code
    if (typeof responseData.message === 'string' && responseData.message.trim().length > 0) {
      if (responseData.message === 'Unauthorized') {
        return 'Correo electrónico o contraseña incorrectos.';
      }
      return responseData.message;
    }

    // 3. Fallback to error field if message is missing
    if (typeof responseData.error === 'string' && responseData.error.trim().length > 0) {
      return responseData.error;
    }
  }

  // 4. Standard AxiosError or Error object message
  const errObj = error as any;
  if (errObj?.message === 'Network Error') {
    return 'Error de conexión. Revisa tu acceso a internet.';
  }

  // Avoid leaking raw status code strings like "Request failed with status code 400"
  if (typeof errObj?.message === 'string' && !errObj.message.includes('Request failed with status code')) {
    return errObj.message;
  }

  return fallbackMessage;
}
