import { AppError, AppErrorCode } from '../../errors';
import { supabase } from '../../../lib/supabase';
import type { Employee } from '../types';
import type { EmployeeListFilters } from '../query-keys';
import { mapEmployee } from './map-employee';

export async function getEmployees(
  filters: EmployeeListFilters,
): Promise<Employee[]> {
  let query = supabase.from('employees').select('*').is('deleted_at', null);

  if (filters.status === 'active') {
    query = query.eq('is_active', true);
  } else if (filters.status === 'inactive') {
    query = query.eq('is_active', false);
  }

  const trimmedSearch = filters.search.trim();
  if (trimmedSearch) {
    const escaped = trimmedSearch.replace(/[%_]/g, '\\$&');
    query = query.or(
      `display_name.ilike.%${escaped}%,first_name.ilike.%${escaped}%,last_name.ilike.%${escaped}%`,
    );
  }

  switch (filters.sort) {
    case 'alphabetical':
      query = query
        .order('last_name', { ascending: true })
        .order('first_name', {
          ascending: true,
        });
      break;
    case 'created_asc':
      query = query.order('created_at', { ascending: true });
      break;
    case 'created_desc':
    case 'default':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Nie udało się pobrać listy pracowników.',
      original: error,
    });
  }

  return (data ?? []).map(mapEmployee);
}
