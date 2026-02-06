import { useState } from 'react';

export interface BusinessRegisterPayload {
  salonName: string;
  email: string;
  password: string;
  gdprAccepted: boolean;
}

export interface UseBusinessRegisterReturn {
  register: (data: BusinessRegisterPayload) => Promise<void>;
  error: string | null;
}

/**
 * Business logic for salon registration.
 *
 * Currently uses a mock implementation.
 * TODO: Replace with Supabase Auth + DB calls.
 */
export function useBusinessRegister(): UseBusinessRegisterReturn {
  const [error, setError] = useState<string | null>(null);

  const register = async (data: BusinessRegisterPayload) => {
    setError(null);

    try {
      // TODO: Replace with real Supabase integration
      // 1. supabase.auth.signUp({ email, password })
      // 2. Insert salon row into `salons` table
      // 3. Link owner profile

      // Mock — simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('[useBusinessRegister] registered:', {
        salonName: data.salonName,
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
