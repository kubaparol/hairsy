import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';
import type { CreateSalonInput } from './create-salon';

export type UpdateSalonInput = Partial<CreateSalonInput>;

/**
 * Update salon information.
 * Only salon owner can update.
 *
 * @throws {SupabaseError} When update fails
 */
export async function updateSalon(
  salonId: string,
  updates: UpdateSalonInput,
): Promise<Tables<'salons'>> {
  const { data, error } = await supabase
    .from('salons')
    .update(updates)
    .eq('id', salonId)
    .select()
    .single();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
