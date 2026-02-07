/**
 * Enum of application error codes.
 * Auth-specific codes + generic fallbacks.
 */
export const AppErrorCode = {
  // Auth errors
  AUTH_EMAIL_TAKEN: 'AUTH_EMAIL_TAKEN',
  AUTH_WEAK_PASSWORD: 'AUTH_WEAK_PASSWORD',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_EMAIL_NOT_CONFIRMED: 'AUTH_EMAIL_NOT_CONFIRMED',
  AUTH_RATE_LIMITED: 'AUTH_RATE_LIMITED',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',

  // Generic errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type AppErrorCodeType = (typeof AppErrorCode)[keyof typeof AppErrorCode];

export interface AppErrorOptions {
  code: AppErrorCodeType;
  message?: string;
  status?: number;
  original?: unknown;
}

const DEFAULT_MESSAGE = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie';

/**
 * Custom application error class.
 * Extends Error with structured code, status, and original error reference.
 */
export class AppError extends Error {
  readonly code: AppErrorCodeType;
  readonly status?: number;
  readonly original?: unknown;

  constructor(options: AppErrorOptions) {
    const message = options.message ?? DEFAULT_MESSAGE;
    super(message);

    this.name = 'AppError';
    this.code = options.code;
    this.status = options.status;
    this.original = options.original;

    // Maintains proper stack trace in V8 environments (Node, Chrome)
    if (
      'captureStackTrace' in Error &&
      typeof Error.captureStackTrace === 'function'
    ) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Type guard to check if an error is an AppError instance.
 * Useful for safe error handling in catch blocks.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
