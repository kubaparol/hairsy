import { useState } from 'react';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UseLoginReturn {
  login: (data: LoginPayload) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Business logic for user login (shared for both OWNER and USER roles).
 *
 * Currently uses a mock implementation.
 * TODO: Replace with Supabase Auth: supabase.auth.signInWithPassword({ email, password })
 * Router will redirect based on user role (OWNER -> /business, USER -> /client).
 */
export function useLogin(): UseLoginReturn {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginPayload) => {
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Replace with real Supabase integration
      // supabase.auth.signInWithPassword({ email: data.email, password: data.password })
      // Then redirect based on profile.role (OWNER -> /business, USER -> /client)

      // Mock — simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('[useLogin] logged in:', { email: data.email });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
