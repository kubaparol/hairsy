import { supabase } from '../../../lib/supabase';
import { AppError, AppErrorCode, handleAuthError } from '../../errors';

export interface SignUpAsClientParams {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  gdprAccepted: boolean;
  termsVersion: string;
}

export interface SignUpAsClientResult {
  userId: string;
  email: string;
}

/**
 * Registers a new client account with Supabase Auth.
 *
 * The database trigger `handle_new_user` automatically:
 * - Creates a profile record with role='USER'
 * - Creates a client_profiles record with first_name, last_name, and phone_number
 * - Records GDPR consent in the consents table
 *
 * @throws {AppError} When registration fails
 */
export async function signUpAsClient(
  params: SignUpAsClientParams,
): Promise<SignUpAsClientResult> {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    gdprAccepted,
    termsVersion,
  } = params;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'USER',
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
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
