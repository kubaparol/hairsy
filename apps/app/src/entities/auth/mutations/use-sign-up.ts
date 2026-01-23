import { useMutation } from '@tanstack/react-query';
import { signUp, type SignUpCredentials, type SignUpOptions } from '../api';
import type { SupabaseError } from '@/entities/_shared';
import type { AuthResponse } from '@supabase/supabase-js';

export interface UseSignUpParams extends SignUpCredentials {
  options?: SignUpOptions;
}

export interface UseSignUpOptions {
  onSuccess?: (data: AuthResponse['data']) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for registering a new user.
 *
 * Note: Does not automatically sign in the user - email confirmation
 * may be required depending on Supabase settings.
 *
 * @example
 * ```tsx
 * function RegisterForm() {
 *   const { mutate: register, isPending, error } = useSignUp({
 *     onSuccess: () => {
 *       toast.success('Check your email to confirm registration!');
 *       navigate('/login');
 *     },
 *   });
 *
 *   const handleSubmit = (e: FormEvent) => {
 *     e.preventDefault();
 *     register({
 *       email,
 *       password,
 *       firstName,
 *       options: { redirectTo: window.location.origin + '/auth/callback' }
 *     });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useSignUp(options?: UseSignUpOptions) {
  return useMutation<AuthResponse['data'], SupabaseError, UseSignUpParams>({
    mutationFn: ({ options: signUpOptions, ...credentials }) =>
      signUp(credentials, signUpOptions),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
