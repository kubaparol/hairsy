import { supabase } from '@/core/supabase';
import {
  parseSupabaseError,
  SupabaseError,
  SupabaseErrorCode,
} from '@/entities/_shared';

const FUTURE_BOOKINGS_MESSAGE =
  'Nie można usunąć usługi — ma przypisane przyszłe rezerwacje.';

/**
 * Check if service has future ONLINE bookings, then soft delete.
 * Only salon owner can delete.
 *
 * @throws {SupabaseError} When service has future ONLINE bookings or query fails
 */
export async function deleteService(serviceId: string): Promise<void> {
  const now = new Date().toISOString();

  const { data: futureBookings, error: selectError } = await supabase
    .from('bookings')
    .select('id')
    .eq('service_id', serviceId)
    .eq('type', 'ONLINE')
    .gte('start_time', now)
    .is('deleted_at', null)
    .limit(1);

  if (selectError) {
    throw parseSupabaseError(selectError);
  }

  if (futureBookings && futureBookings.length > 0) {
    throw new SupabaseError(
      FUTURE_BOOKINGS_MESSAGE,
      SupabaseErrorCode.UNKNOWN,
      null,
      null,
    );
  }

  const { error: updateError } = await supabase
    .from('services')
    .update({ deleted_at: now })
    .eq('id', serviceId);

  if (updateError) {
    throw parseSupabaseError(updateError);
  }
}
