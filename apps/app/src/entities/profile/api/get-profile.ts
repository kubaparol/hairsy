import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

/**
 * Get user profile by user ID.
 * Returns null if profile doesn't exist or has been deleted.
 *
 * @throws {SupabaseError} When query fails (other than not found)
 */
export async function getProfile(
  userId: string,
): Promise<Tables<'profiles'> | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .is('deleted_at', null)
    .single();

  if (error) {
    // PGRST116 = No rows returned
    if (error.code === 'PGRST116') {
      return null;
    }
    throw parseSupabaseError(error);
  }

  return data;
}
