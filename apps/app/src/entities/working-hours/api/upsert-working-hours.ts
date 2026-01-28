import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface WorkingHoursInput {
  day_of_week: number; // 0-6
  open_time: string; // TIME format (HH:mm:ss)
  close_time: string; // TIME format (HH:mm:ss)
}

/**
 * Create or update working hours for multiple days.
 * Only salon owner can manage working hours.
 *
 * @throws {SupabaseError} When validation fails (open_time >= close_time)
 */
export async function upsertWorkingHours(
  salonId: string,
  data: WorkingHoursInput[],
): Promise<Tables<'working_hours'>[]> {
  const { data: workingHours, error } = await supabase
    .from('working_hours')
    .upsert(
      data.map((d) => ({
        ...d,
        salon_id: salonId,
      })),
      {
        onConflict: 'salon_id,day_of_week',
      },
    )
    .select();

  if (error) {
    throw parseSupabaseError(error);
  }

  return workingHours ?? [];
}
