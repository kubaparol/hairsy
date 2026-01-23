import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import { SupabaseError, SupabaseErrorCode } from '../errors/supabase-error';

/**
 * Maps Supabase Auth error codes to application error codes
 */
function mapAuthErrorCode(error: AuthError): SupabaseErrorCode {
  const code = error.code;
  const status = error.status;

  // Rate limiting
  if (status === 429 || code === 'over_request_rate_limit') {
    return SupabaseErrorCode.RATE_LIMITED;
  }

  // Map specific auth error codes
  switch (code) {
    case 'invalid_credentials':
    case 'invalid_grant':
      return SupabaseErrorCode.INVALID_CREDENTIALS;

    case 'email_not_confirmed':
      return SupabaseErrorCode.EMAIL_NOT_CONFIRMED;

    case 'user_already_exists':
    case 'email_exists':
      return SupabaseErrorCode.USER_ALREADY_EXISTS;

    case 'weak_password':
      return SupabaseErrorCode.WEAK_PASSWORD;

    case 'session_not_found':
    case 'refresh_token_not_found':
      return SupabaseErrorCode.SESSION_EXPIRED;

    default:
      return SupabaseErrorCode.UNKNOWN;
  }
}

/**
 * Maps PostgreSQL/PostgREST error codes to application error codes
 */
function mapPostgrestErrorCode(error: PostgrestError): SupabaseErrorCode {
  const code = error.code;

  switch (code) {
    case 'PGRST116': // No rows returned
      return SupabaseErrorCode.ROW_NOT_FOUND;

    case '23505': // unique_violation
      return SupabaseErrorCode.UNIQUE_VIOLATION;

    case '23503': // foreign_key_violation
      return SupabaseErrorCode.FOREIGN_KEY_VIOLATION;

    case '42501': // insufficient_privilege
    case 'PGRST301': // JWT expired
      return SupabaseErrorCode.PERMISSION_DENIED;

    default:
      return SupabaseErrorCode.UNKNOWN;
  }
}

/**
 * Type guard for AuthError
 * AuthError has name 'AuthApiError' or 'AuthRetryableFetchError' and specific properties
 */
function isAuthError(error: unknown): error is AuthError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const err = error as Record<string, unknown>;

  // Check for AuthError structure: has name, message, status and code properties
  // AuthError names: 'AuthApiError', 'AuthRetryableFetchError', 'AuthSessionMissingError', etc.
  return (
    typeof err.name === 'string' &&
    err.name.startsWith('Auth') &&
    'status' in err &&
    'code' in err &&
    'message' in err
  );
}

/**
 * Type guard for PostgrestError
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error &&
    !('__isAuthError' in error)
  );
}

/**
 * Parses any Supabase error into a consistent SupabaseError instance.
 * Use this function to handle errors from Supabase operations uniformly.
 *
 * @example
 * ```ts
 * const { data, error } = await supabase.auth.signInWithPassword(credentials);
 * if (error) {
 *   throw parseSupabaseError(error);
 * }
 * ```
 */
export function parseSupabaseError(error: unknown): SupabaseError {
  // Already a SupabaseError - return as is
  if (error instanceof SupabaseError) {
    return error;
  }

  // Handle AuthError
  if (isAuthError(error)) {
    const code = mapAuthErrorCode(error);
    return new SupabaseError(
      getUserFriendlyMessage(code, error.message),
      code,
      error,
      error.status,
    );
  }

  // Handle PostgrestError
  if (isPostgrestError(error)) {
    const code = mapPostgrestErrorCode(error);
    return new SupabaseError(
      getUserFriendlyMessage(code, error.message),
      code,
      error,
      null,
    );
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new SupabaseError(
      'Błąd połączenia z serwerem. Sprawdź swoje połączenie internetowe.',
      SupabaseErrorCode.NETWORK_ERROR,
      error,
      null,
    );
  }

  // Handle generic Error
  if (error instanceof Error) {
    return new SupabaseError(
      error.message,
      SupabaseErrorCode.UNKNOWN,
      error,
      null,
    );
  }

  // Fallback for unknown error types
  return new SupabaseError(
    'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
    SupabaseErrorCode.UNKNOWN,
    null,
    null,
  );
}

/**
 * Returns user-friendly error messages in Polish.
 * Can be extended to support i18n in the future.
 */
function getUserFriendlyMessage(
  code: SupabaseErrorCode,
  fallback: string,
): string {
  const messages: Record<SupabaseErrorCode, string> = {
    [SupabaseErrorCode.INVALID_CREDENTIALS]:
      'Nieprawidłowy email lub hasło. Spróbuj ponownie.',
    [SupabaseErrorCode.EMAIL_NOT_CONFIRMED]:
      'Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową.',
    [SupabaseErrorCode.USER_ALREADY_EXISTS]:
      'Użytkownik z tym adresem email już istnieje.',
    [SupabaseErrorCode.WEAK_PASSWORD]:
      'Hasło jest zbyt słabe. Użyj co najmniej 8 znaków, w tym cyfr i znaków specjalnych.',
    [SupabaseErrorCode.SESSION_EXPIRED]: 'Sesja wygasła. Zaloguj się ponownie.',
    [SupabaseErrorCode.RATE_LIMITED]:
      'Zbyt wiele prób. Poczekaj chwilę i spróbuj ponownie.',
    [SupabaseErrorCode.ROW_NOT_FOUND]: 'Nie znaleziono żądanych danych.',
    [SupabaseErrorCode.UNIQUE_VIOLATION]: 'Ten rekord już istnieje w systemie.',
    [SupabaseErrorCode.FOREIGN_KEY_VIOLATION]:
      'Nie można wykonać operacji - powiązane dane nie istnieją.',
    [SupabaseErrorCode.PERMISSION_DENIED]:
      'Brak uprawnień do wykonania tej operacji.',
    [SupabaseErrorCode.NETWORK_ERROR]:
      'Błąd połączenia z serwerem. Sprawdź swoje połączenie internetowe.',
    [SupabaseErrorCode.UNKNOWN]: fallback,
  };

  return messages[code];
}
