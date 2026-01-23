import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';

export type SignOutScope = 'global' | 'local' | 'others';

export interface SignOutOptions {
  /**
   * Scope of the sign out:
   * - 'global': Sign out from all devices
   * - 'local': Sign out only from current device (default)
   * - 'others': Sign out from all other devices except current
   */
  scope?: SignOutScope;
}

/**
 * Sign out the current user.
 *
 * @throws {SupabaseError} When sign out fails
 */
export async function signOut(options?: SignOutOptions) {
  const { error } = await supabase.auth.signOut({
    scope: options?.scope ?? 'local',
  });

  if (error) {
    throw parseSupabaseError(error);
  }
}
