import type { AppErrorCodeType } from './app-error';

/**
 * Polish user-facing error messages for each AppErrorCode.
 * Used by handleAuthError to provide localized error messages.
 */
export const ERROR_MESSAGES: Record<AppErrorCodeType, string> = {
  // Auth errors
  AUTH_EMAIL_TAKEN: 'Ten adres e-mail jest już zarejestrowany',
  AUTH_WEAK_PASSWORD:
    'Hasło jest za słabe. Spróbuj dłuższe lub bardziej złożone',
  AUTH_INVALID_CREDENTIALS: 'Nieprawidłowy e-mail lub hasło',
  AUTH_USER_NOT_FOUND: 'Nie znaleziono konta z tym adresem e-mail',
  AUTH_EMAIL_NOT_CONFIRMED: 'Potwierdź swój adres e-mail przed zalogowaniem',
  AUTH_RATE_LIMITED: 'Zbyt wiele prób. Spróbuj ponownie za chwilę',
  AUTH_SESSION_EXPIRED: 'Sesja wygasła. Zaloguj się ponownie',

  // Generic errors
  NETWORK_ERROR: 'Błąd połączenia. Sprawdź internet i spróbuj ponownie',
  VALIDATION_ERROR: 'Wprowadzone dane są nieprawidłowe',
  UNKNOWN: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie',
};
