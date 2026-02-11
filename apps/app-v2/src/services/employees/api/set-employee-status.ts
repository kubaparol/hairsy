import { AppError, AppErrorCode } from '../../errors';
import { supabase } from '../../../lib/supabase';

export interface SetEmployeeStatusParams {
  id: string;
  isActive: boolean;
}

export async function setEmployeeStatus(
  params: SetEmployeeStatusParams,
): Promise<void> {
  const { error } = await supabase
    .from('employees')
    .update({ is_active: params.isActive })
    .eq('id', params.id)
    .is('deleted_at', null);

  if (error) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Nie udało się zmienić statusu pracownika.',
      original: error,
    });
  }
}
