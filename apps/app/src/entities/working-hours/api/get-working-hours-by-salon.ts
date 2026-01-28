import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

/**
 * Get all working hours for a salon (0-6 days).
 * Public for complete salons, owner can see all.
 *
 * @throws {SupabaseError} When query fails
 */
export async function getWorkingHoursBySalon(
  salonId: string,
): Promise<Tables<'working_hours'>[]> {
  const { data, error } = await supabase
    .from('working_hours')
    .select('*')
    .eq('salon_id', salonId)
    .order('day_of_week');

  if (error) {
    throw parseSupabaseError(error);
  }

  return data ?? [];
}
