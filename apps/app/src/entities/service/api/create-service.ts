import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface CreateServiceInput {
  name: string;
  description?: string;
  duration_minutes: number; // Required, 15-240, multiple of 15
  price: number; // Required, 1-10000 PLN (integer, no decimals)
}

/**
 * Create new service for salon.
 * Only salon owner can create services.
 *
 * @throws {SupabaseError} When validation fails (duration not multiple of 15, price out of range)
 */
export async function createService(
  salonId: string,
  data: CreateServiceInput,
): Promise<Tables<'services'>> {
  const { data: service, error } = await supabase
    .from('services')
    .insert({
      ...data,
      salon_id: salonId,
    })
    .select()
    .single();

  if (error) {
    throw parseSupabaseError(error);
  }

  return service;
}
