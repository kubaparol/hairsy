import { supabase } from '@/core/supabase';
import { parseSupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface AcceptConsentsInput {
  userId: string;
  policyVersions: string[];
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Record user consent for multiple policies.
 * Should be called during registration or when policies are updated.
 *
 * @throws {SupabaseError} When consent recording fails
 */
export async function acceptConsents(
  input: AcceptConsentsInput,
): Promise<Tables<'consents'>[]> {
  const { data, error } = await supabase
    .from('consents')
    .insert(
      input.policyVersions.map((version) => ({
        user_id: input.userId,
        policy_version: version,
        ip_address: input.ipAddress,
        user_agent: input.userAgent,
      })),
    )
    .select();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
