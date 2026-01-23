import type { AuthError, PostgrestError } from '@supabase/supabase-js';

// Type for V8's Error.captureStackTrace
interface ErrorWithCaptureStackTrace extends ErrorConstructor {
  captureStackTrace(
    targetObject: object,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    constructorOpt?: Function,
  ): void;
}

/**
 * Unified error codes for Supabase operations.
 * Maps common Supabase error codes to application-specific codes.
 */
export const SupabaseErrorCode = {
  // Auth errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED: 'EMAIL_NOT_CONFIRMED',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  RATE_LIMITED: 'RATE_LIMITED',

  // Database errors
  ROW_NOT_FOUND: 'ROW_NOT_FOUND',
  UNIQUE_VIOLATION: 'UNIQUE_VIOLATION',
  FOREIGN_KEY_VIOLATION: 'FOREIGN_KEY_VIOLATION',
  PERMISSION_DENIED: 'PERMISSION_DENIED',

  // Generic
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type SupabaseErrorCode =
  (typeof SupabaseErrorCode)[keyof typeof SupabaseErrorCode];

/**
 * Custom error class for Supabase operations.
 * Provides consistent error handling across the application.
 */
export class SupabaseError extends Error {
  readonly code: SupabaseErrorCode;
  readonly originalError: AuthError | PostgrestError | Error | null;
  readonly statusCode: number | null;

  constructor(
    message: string,
    code: SupabaseErrorCode,
    originalError: AuthError | PostgrestError | Error | null = null,
    statusCode: number | null = null,
  ) {
    super(message);
    this.name = 'SupabaseError';
    this.code = code;
    this.originalError = originalError;
    this.statusCode = statusCode;

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if ('captureStackTrace' in Error) {
      (Error as ErrorWithCaptureStackTrace).captureStackTrace(
        this,
        SupabaseError,
      );
    }
  }

  /**
   * Check if error is a specific type
   */
  is(code: SupabaseErrorCode): boolean {
    return this.code === code;
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    const authCodes: SupabaseErrorCode[] = [
      SupabaseErrorCode.INVALID_CREDENTIALS,
      SupabaseErrorCode.EMAIL_NOT_CONFIRMED,
      SupabaseErrorCode.USER_ALREADY_EXISTS,
      SupabaseErrorCode.WEAK_PASSWORD,
      SupabaseErrorCode.SESSION_EXPIRED,
    ];
    return authCodes.includes(this.code);
  }

  /**
   * Check if error is a database error
   */
  isDbError(): boolean {
    const dbCodes: SupabaseErrorCode[] = [
      SupabaseErrorCode.ROW_NOT_FOUND,
      SupabaseErrorCode.UNIQUE_VIOLATION,
      SupabaseErrorCode.FOREIGN_KEY_VIOLATION,
      SupabaseErrorCode.PERMISSION_DENIED,
    ];
    return dbCodes.includes(this.code);
  }

  /**
   * Check if error should trigger a retry
   */
  isRetryable(): boolean {
    const retryableCodes: SupabaseErrorCode[] = [
      SupabaseErrorCode.NETWORK_ERROR,
      SupabaseErrorCode.RATE_LIMITED,
    ];
    return retryableCodes.includes(this.code);
  }
}
