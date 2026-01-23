import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';

export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign in user with email and password.
 * Returns the authenticated session data.
 *
 * @throws {SupabaseError} When authentication fails
 */
export async function signIn({ email, password }: SignInCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
