import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

/**
 * Get salon for a specific owner (1:1 relationship).
 * Owner can see their salon even if incomplete.
 *
 * @returns Salon or null if not found
 * @throws {SupabaseError} When query fails (other than not found)
 */
export async function getSalonByOwner(
  ownerId: string,
): Promise<Tables<'salons'> | null> {
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', ownerId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
