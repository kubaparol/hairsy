import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface CreateProfileInput {
  userId: string;
  email: string;
  firstName: string;
  role: 'OWNER' | 'USER';
}

/**
 * Create a new user profile in the database.
 * Should be called immediately after user registration.
 *
 * @throws {SupabaseError} When profile creation fails
 */
export async function createProfile(
  input: CreateProfileInput,
): Promise<Tables<'profiles'>> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: input.userId,
      email: input.email,
      first_name: input.firstName,
      role: input.role,
    })
    .select()
    .single();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
