import { useState } from 'react';

export interface ClientRegisterPayload {
  firstName: string;
  email: string;
  password: string;
  gdprAccepted: boolean;
}

export interface UseClientRegisterReturn {
  register: (data: ClientRegisterPayload) => Promise<void>;
  error: string | null;
}

/**
 * Business logic for client (B2C) registration.
 *
 * Currently uses a mock implementation.
 * TODO: Replace with Supabase Auth + DB:
 * 1. supabase.auth.signUp({ email, password })
 * 2. Trigger handle_new_user creates profile with role USER
 * 3. Update profile with firstName (or separate table if needed)
 */
export function useClientRegister(): UseClientRegisterReturn {
  const [error, setError] = useState<string | null>(null);

  const register = async (data: ClientRegisterPayload) => {
    setError(null);

    try {
      // TODO: Replace with real Supabase integration
      // supabase.auth.signUp({ email, password })
      // Profile with role USER created by trigger; update display name / firstName

      // Mock — simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('[useClientRegister] registered:', {
        firstName: data.firstName,
        email: data.email,
        gdprAccepted: data.gdprAccepted,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd';
      setError(message);
      throw err;
    }
  };

  return { register, error };
}
