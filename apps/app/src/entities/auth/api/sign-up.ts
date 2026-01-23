import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
}

export interface SignUpOptions {
  /** URL to redirect to after email confirmation */
  redirectTo?: string;
}

/**
 * Register a new user with email and password.
 * User will receive a confirmation email.
 *
 * @throws {SupabaseError} When registration fails
 */
export async function signUp(
  { email, password, firstName }: SignUpCredentials,
  options?: SignUpOptions,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: options?.redirectTo,
      data: {
        first_name: firstName,
      },
    },
  });

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
