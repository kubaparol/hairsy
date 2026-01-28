import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface CreateSalonInput {
  name?: string;
  description?: string;
  phone?: string;
  street?: string;
  street_number?: string;
  postal_code?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Create a new salon for an owner.
 * Only users with OWNER role can create salons.
 *
 * @throws {SupabaseError} When creation fails (e.g., duplicate owner_id)
 */
export async function createSalon(
  ownerId: string,
  data: CreateSalonInput,
): Promise<Tables<'salons'>> {
  const { data: salon, error } = await supabase
    .from('salons')
    .insert({
      ...data,
      owner_id: ownerId,
    })
    .select()
    .single();

  if (error) {
    throw parseSupabaseError(error);
  }

  return salon;
}
