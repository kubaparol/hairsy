import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';

/**
 * Get the current user session.
 * Returns null if no active session exists.
 *
 * @throws {SupabaseError} When session retrieval fails unexpectedly
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data.session;
}

/**
 * Get the current authenticated user.
 * Returns null if no active session exists.
 *
 * Note: This makes a network request to verify the session.
 * Use getSession() for quick local checks.
 *
 * @throws {SupabaseError} When user retrieval fails unexpectedly
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    // getUser returns an error when no session exists - this is expected
    if (error.code === 'session_not_found') {
      return null;
    }
    throw parseSupabaseError(error);
  }

  return data.user;
}
