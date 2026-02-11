import { AppError, AppErrorCode } from '../../errors';
import { supabase } from '../../../lib/supabase';

export async function hardDeleteEmployee(id: string): Promise<void> {
  const { error } = await supabase.from('employees').delete().eq('id', id);

  if (error) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Nie udało się trwale usunąć pracownika.',
      original: error,
    });
  }
}
