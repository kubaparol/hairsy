import { AppError, AppErrorCode } from '../../errors';
import { supabase } from '../../../lib/supabase';

export function normalizeOptional(value?: string): string | null {
  const next = value?.trim();
  return next ? next : null;
}

export async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError({
      code: AppErrorCode.AUTH_SESSION_EXPIRED,
      message: 'Sesja wygasła. Zaloguj się ponownie.',
      original: error,
    });
  }

  return user.id;
}

export async function getOwnedSalonId(): Promise<string> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', userId)
    .single();

  if (error || !data) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Nie znaleziono salonu przypisanego do konta.',
      original: error,
    });
  }

  return data.id;
}
