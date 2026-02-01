import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  duration_minutes?: number; // 15-240, multiple of 15
  price?: number; // 1-10000 PLN (integer, no decimals)
}

/**
 * Update service.
 * Only salon owner can update.
 * Duration must remain multiple of 15. Does not affect existing booking snapshots.
 *
 * @throws {SupabaseError} When validation fails or query fails
 */
export async function updateService(
  serviceId: string,
  updates: UpdateServiceInput,
): Promise<Tables<'services'>> {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', serviceId)
    .select()
    .single();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
