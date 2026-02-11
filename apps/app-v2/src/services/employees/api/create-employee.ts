import { AppError, AppErrorCode } from '../../errors';
import { supabase } from '../../../lib/supabase';
import type { CreateEmployeeParams, Employee } from '../types';
import { mapEmployee } from './map-employee';
import { getOwnedSalonId, normalizeOptional } from './shared';

export async function createEmployee(
  params: CreateEmployeeParams,
): Promise<Employee> {
  const salonId = await getOwnedSalonId();

  const payload = {
    salon_id: salonId,
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
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Nie udało się dodać pracownika.',
      original: error,
    });
  }

  return mapEmployee(data);
}
