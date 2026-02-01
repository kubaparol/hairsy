import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface SalonFilters {
  city?: string;
  limit?: number;
  offset?: number;
}

const DEFAULT_LIMIT = 50;

export type CompleteSalonRow = Tables<'v_complete_salons'>;

export interface ListCompleteSalonsResult {
  data: CompleteSalonRow[];
  count: number;
}

/**
 * List complete and active salons for public listing.
 * Uses view v_complete_salons (only complete salons).
 * Sorted alphabetically by salon name.
 *
 * @param filters - Optional city filter and pagination
 * @returns List of complete salons and total count
 * @throws {SupabaseError} When query fails
 */
export async function listCompleteSalons(
  filters?: SalonFilters,
): Promise<ListCompleteSalonsResult> {
  const limit = filters?.limit ?? DEFAULT_LIMIT;
  const offset = filters?.offset ?? 0;
  const city = filters?.city?.trim();

  let query = supabase
    .from('v_complete_salons')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);

  if (city) {
    query = query.ilike('city', city);
  }

  const { data, error, count } = await query;

  if (error) {
    throw parseSupabaseError(error);
  }

  const rows = (data ?? []) as CompleteSalonRow[];
  return {
    data: rows.filter((r) => r.id != null),
    count: count ?? 0,
  };
}
