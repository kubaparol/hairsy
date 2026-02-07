import type { AuthError } from '@supabase/supabase-js';

import { AppError, AppErrorCode, type AppErrorCodeType } from './app-error';
import { ERROR_MESSAGES } from './error-messages';

/**
 * Map of Supabase auth error codes to AppErrorCode.
 * Supabase uses different error code formats depending on the error type.
 */
const AUTH_ERROR_CODE_MAP: Record<string, AppErrorCodeType> = {
  // Email already registered
  user_already_exists: AppErrorCode.AUTH_EMAIL_TAKEN,
  email_exists: AppErrorCode.AUTH_EMAIL_TAKEN,
  'User already registered': AppErrorCode.AUTH_EMAIL_TAKEN,

  // Weak password
  weak_password: AppErrorCode.AUTH_WEAK_PASSWORD,

  // Invalid credentials (sign-in)
  invalid_credentials: AppErrorCode.AUTH_INVALID_CREDENTIALS,
  invalid_grant: AppErrorCode.AUTH_INVALID_CREDENTIALS,
  'Invalid login credentials': AppErrorCode.AUTH_INVALID_CREDENTIALS,

  // User not found
  user_not_found: AppErrorCode.AUTH_USER_NOT_FOUND,

  // Email not confirmed
  email_not_confirmed: AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,
  'Email not confirmed': AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,

  // Rate limited
  over_request_rate_limit: AppErrorCode.AUTH_RATE_LIMITED,
  too_many_requests: AppErrorCode.AUTH_RATE_LIMITED,

  // Session expired
  session_expired: AppErrorCode.AUTH_SESSION_EXPIRED,
  refresh_token_not_found: AppErrorCode.AUTH_SESSION_EXPIRED,
  'JWT expired': AppErrorCode.AUTH_SESSION_EXPIRED,
};

/**
 * Regex patterns for fallback error message matching.
 * Used when Supabase doesn't provide a clean error code.
 */
const ERROR_MESSAGE_PATTERNS: Array<{
  pattern: RegExp;
  code: AppErrorCodeType;
}> = [
  { pattern: /already registered/i, code: AppErrorCode.AUTH_EMAIL_TAKEN },
  { pattern: /email.*exists/i, code: AppErrorCode.AUTH_EMAIL_TAKEN },
  { pattern: /weak.*password/i, code: AppErrorCode.AUTH_WEAK_PASSWORD },
  { pattern: /password.*weak/i, code: AppErrorCode.AUTH_WEAK_PASSWORD },
  {
    pattern: /invalid.*credentials/i,
    code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
  },
  { pattern: /invalid.*login/i, code: AppErrorCode.AUTH_INVALID_CREDENTIALS },
  { pattern: /user.*not.*found/i, code: AppErrorCode.AUTH_USER_NOT_FOUND },
  {
    pattern: /email.*not.*confirmed/i,
    code: AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,
  },
  { pattern: /rate.*limit/i, code: AppErrorCode.AUTH_RATE_LIMITED },
  { pattern: /too.*many.*requests/i, code: AppErrorCode.AUTH_RATE_LIMITED },
  { pattern: /session.*expired/i, code: AppErrorCode.AUTH_SESSION_EXPIRED },
  { pattern: /jwt.*expired/i, code: AppErrorCode.AUTH_SESSION_EXPIRED },
  { pattern: /token.*expired/i, code: AppErrorCode.AUTH_SESSION_EXPIRED },
];

/**
 * Resolves AppErrorCode from Supabase AuthError.
 * Checks error code first, then falls back to message pattern matching.
 */
function resolveErrorCode(error: AuthError): AppErrorCodeType {
  // Check by error code (Supabase sometimes uses 'code' property)
  const errorCode = (error as AuthError & { code?: string }).code;
  if (errorCode && AUTH_ERROR_CODE_MAP[errorCode]) {
    return AUTH_ERROR_CODE_MAP[errorCode];
  }

  // Check by error message in the map (exact match)
  if (error.message && AUTH_ERROR_CODE_MAP[error.message]) {
    return AUTH_ERROR_CODE_MAP[error.message];
  }

  // Fallback: regex pattern matching on error message
  if (error.message) {
    for (const { pattern, code } of ERROR_MESSAGE_PATTERNS) {
      if (pattern.test(error.message)) {
        return code;
      }
    }
  }

  // Check for network-level errors by status code
  if (error.status === 0 || error.status === undefined) {
    return AppErrorCode.NETWORK_ERROR;
  }

  if (error.status === 429) {
    return AppErrorCode.AUTH_RATE_LIMITED;
  }

  return AppErrorCode.UNKNOWN;
}

/**
 * Transforms a Supabase AuthError into a structured AppError.
 * Maps known error codes to user-friendly Polish messages.
 *
 * @param error - The AuthError from Supabase auth operations
 * @returns AppError with appropriate code and localized message
 *
 * @example
 * ```ts
 * const { data, error } = await supabase.auth.signUp({ ... });
 * if (error) throw handleAuthError(error);
 * ```
 */
export function handleAuthError(error: AuthError): AppError {
  const code = resolveErrorCode(error);
  const message = ERROR_MESSAGES[code];

  return new AppError({
    code,
    message,
    status: error.status,
    original: error,
  });
}
