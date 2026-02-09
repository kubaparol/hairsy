import { supabase } from '../../../lib/supabase';

/**
 * Signs out the current user from Supabase Auth.
 *
 * @throws {Error} When sign out fails
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
