import { supabase } from '../../../lib/supabase';
import { handleAuthError } from '../../errors';
import type { UserProfile } from '../../../lib/auth-types';

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignInResult {
  userId: string;
  email: string;
  profile: UserProfile;
}

/**
 * Authenticates user with Supabase Auth and fetches their profile.
 *
 * @throws {AppError} When authentication fails or profile is not found
 */
export async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  // Authenticate with Supabase
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    throw handleAuthError(authError);
  }

  if (!authData.user) {
    throw new Error('Błąd uwierzytelniania');
  }

  // Fetch user profile to get role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Nie znaleziono profilu użytkownika');
  }

  return {
    userId: authData.user.id,
    email: authData.user.email ?? email,
    profile,
  };
}
