import { AppError, AppErrorCode } from '../../errors';
import { supabase } from '../../../lib/supabase';
import type { EmployeeStats } from '../types';

const RECENT_WINDOW_DAYS = 30;

export async function getEmployeeStats(): Promise<EmployeeStats> {
  const { data, error } = await supabase
    .from('employees')
    .select('id, is_active, created_at')
    .is('deleted_at', null);

  if (error) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Nie udało się pobrać statystyk pracowników.',
      original: error,
    });
  }

  const now = Date.now();
  const recentMs = RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const rows = data ?? [];

  let active = 0;
  let inactive = 0;
  let recentlyAdded = 0;

  for (const row of rows) {
    if (row.is_active) active += 1;
    else inactive += 1;

    const createdAt = new Date(row.created_at).getTime();
    if (!Number.isNaN(createdAt) && now - createdAt <= recentMs) {
      recentlyAdded += 1;
    }
  }

  return {
    total: rows.length,
    active,
    inactive,
    recentlyAdded,
  };
}
