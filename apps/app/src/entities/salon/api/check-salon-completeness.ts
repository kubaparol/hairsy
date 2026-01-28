import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';

/**
 * Check if salon meets all requirements for public visibility.
 * Uses database function is_salon_complete().
 *
 * @throws {SupabaseError} When RPC call fails
 */
export async function checkSalonCompleteness(
  salonId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_salon_complete', {
    p_salon_id: salonId,
  });

  if (error) {
    throw parseSupabaseError(error);
  }

  return data ?? false;
}
