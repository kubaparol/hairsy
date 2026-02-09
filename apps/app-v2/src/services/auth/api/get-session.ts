import { supabase } from '../../../lib/supabase';
import type { AuthState } from '../../../lib/auth-types';

/**
 * Fetches the current authentication session and user profile
 *
 * @returns AuthState with user, profile, and authentication status
 * @throws Error if profile is not found for authenticated user (system error)
 */
export async function getSession(): Promise<AuthState> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // No session or error fetching session
  if (sessionError || !session) {
    return {
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    };
  }

  // Fetch user profile from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  // Profile not found is a critical system error
  // The database trigger should have created it on signup
  if (profileError || !profile) {
    throw new Error('Profile not found for authenticated user');
  }

  return {
    user: session.user,
    profile,
    isLoading: false,
    isAuthenticated: true,
  };
}
