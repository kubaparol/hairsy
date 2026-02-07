import { supabase } from '../../../lib/supabase';
import { AppError, AppErrorCode, handleAuthError } from '../../errors';

export interface SignUpAsBusinessParams {
  salonName: string;
  email: string;
  password: string;
  gdprAccepted: boolean;
  termsVersion: string;
}

export interface SignUpAsBusinessResult {
  userId: string;
  email: string;
}

/**
 * Registers a new business owner account with Supabase Auth.
 *
 * The database trigger `handle_new_user` automatically:
 * - Creates a profile record with role='OWNER'
 * - Creates a salon record with the provided name and status='DRAFT'
 * - Records GDPR consent in the consents table
 *
 * @throws {AppError} When registration fails
 */
export async function signUpAsBusiness(
  params: SignUpAsBusinessParams,
): Promise<SignUpAsBusinessResult> {
  const { salonName, email, password, gdprAccepted, termsVersion } = params;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'OWNER',
        salon_name: salonName,
        gdpr_accepted: gdprAccepted,
        terms_version: termsVersion,
      },
    },
  });

  if (error) {
    throw handleAuthError(error);
  }

  // Supabase returns user even when email confirmation is required
  // but user.id is always available after successful signUp
  if (!data.user) {
    throw new AppError({
      code: AppErrorCode.UNKNOWN,
      message: 'Wystąpił nieoczekiwany błąd podczas rejestracji',
    });
  }

  return {
    userId: data.user.id,
    email: data.user.email ?? email,
  };
}
