import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

/**
 * Get salon by ID.
 * Public: only complete salons are visible (RLS).
 * Owner: can see own salon even if incomplete.
 *
 * @returns Salon or null if not found / not visible
 * @throws {SupabaseError} When query fails (other than not found)
 */
export async function getSalon(
  salonId: string,
): Promise<Tables<'salons'> | null> {
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
