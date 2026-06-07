/** Custom error class for API errors. */
/** Structured error with HTTP status and optional error code. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }

  /** Type guard to check if an error is an ApiError. */
  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError
  }

  /** Create a 401 Unauthorized error. */
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, 'UNAUTHORIZED')
  }

  /** Create a 404 Not Found error. */
  static notFound(message = 'Not found') {
    return new ApiError(404, message, 'NOT_FOUND')
  }

  /** Create a 400 Validation error. */
  static validation(message = 'Validation error') {
    return new ApiError(400, message, 'VALIDATION_ERROR')
  }

  /** Create a 500 Internal Server error. */
  static server(message = 'Internal server error') {
    return new ApiError(500, message, 'SERVER_ERROR')
  }

  /** Create a network error (status 0). */
  static network(message = 'Network error') {
    return new ApiError(0, message, 'NETWORK_ERROR')
  }
}
