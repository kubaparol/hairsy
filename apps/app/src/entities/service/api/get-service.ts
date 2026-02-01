import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

/**
 * Get single service by ID.
 * Only returns active (non-deleted) services.
 *
 * @throws {SupabaseError} When query fails
 */
export async function getService(
  serviceId: string,
): Promise<Tables<'services'> | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
