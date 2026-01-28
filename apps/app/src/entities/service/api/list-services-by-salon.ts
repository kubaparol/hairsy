import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

/**
 * Get all active services for a salon.
 * Public for complete salons, owner can see all.
 *
 * @throws {SupabaseError} When query fails
 */
export async function listServicesBySalon(
  salonId: string,
): Promise<Tables<'services'>[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .order('name');

  if (error) {
    throw parseSupabaseError(error);
  }

  return data ?? [];
}
