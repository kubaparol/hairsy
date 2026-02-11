import { AppError, AppErrorCode } from '../../errors';
import { supabase } from '../../../lib/supabase';
import type { Employee, UpdateEmployeeParams } from '../types';
import { mapEmployee } from './map-employee';
import { normalizeOptional } from './shared';

export async function updateEmployee(
  params: UpdateEmployeeParams,
): Promise<Employee> {
  const payload = {
    first_name: params.firstName.trim(),
    last_name: params.lastName.trim(),
    display_name: `${params.firstName.trim()} ${params.lastName.trim()}`,
    bio: normalizeOptional(params.bio),
    avatar_url: normalizeOptional(params.avatarUrl),
    phone_number: normalizeOptional(params.phoneNumber),
    email: normalizeOptional(params.email),
  };

  const { data, error } = await supabase
    .from('employees')
    .update(payload)
    .eq('id', params.id)
    .is('deleted_at', null)
    .select('*')
    .single();

  if (error || !data) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Nie udało się zapisać zmian pracownika.',
      original: error,
    });
  }

  return mapEmployee(data);
}
