import { AppError, AppErrorCode } from '../../errors';
import { supabase } from '../../../lib/supabase';
import { getCurrentUserId } from './shared';

export async function softDeleteEmployee(id: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('employees')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
    })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Nie udało się usunąć pracownika.',
      original: error,
    });
  }
}
