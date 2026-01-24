import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signUp, type SignUpCredentials, type SignUpOptions } from '../api';
import { createProfile } from '@/entities/profile';
import { acceptConsents } from '@/entities/consent';
import type { SupabaseError } from '@/entities/_shared';
import type { AuthResponse } from '@supabase/supabase-js';

export interface UseSignUpParams extends SignUpCredentials {
  options?: SignUpOptions;
  role?: 'OWNER' | 'USER';
  consents?: string[];
}

export interface UseSignUpOptions {
  onSuccess?: (data: AuthResponse['data']) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for registering a new user.
 *
 * Supports two modes:
 * 1. Basic registration (email + password only)
 * 2. Full registration with profile and consents (when role and consents are provided)
 *
 * Note: Does not automatically sign in the user - email confirmation
 * may be required depending on Supabase settings.
 *
 * @example
 * Basic registration:
 * ```tsx
 * function BasicRegisterForm() {
 *   const { mutate: register, isPending } = useSignUp({
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
 *     });
 *   };
 * }
 * ```
 *
 * @example
 * Full registration with profile and consents:
 * ```tsx
 * function SignUpForm() {
 *   const { mutate: register, isPending } = useSignUp({
 *     onSuccess: () => {
 *       toast.success('Check your email to confirm registration!');
 *       navigate('/sign-in');
 *     },
 *   });
 *
 *   const handleSubmit = (data: SignUpFormValues) => {
 *     register({
 *       email: data.email,
 *       password: data.password,
 *       firstName: data.firstName,
 *       role: data.role,
 *       consents: data.consents,
 *     });
 *   };
 * }
 * ```
 */
export function useSignUp(options?: UseSignUpOptions) {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse['data'], SupabaseError, UseSignUpParams>({
    mutationFn: async ({
      options: signUpOptions,
      role,
      consents,
      ...credentials
    }) => {
      // Step 1: Register user with Supabase Auth
      const authData = await signUp(credentials, signUpOptions);

      if (!authData.user) {
        throw new Error('Nie udało się utworzyć konta');
      }

      // Step 2 & 3: Create profile and record consents (if role and consents provided)
      if (role && consents) {
        await createProfile({
          userId: authData.user.id,
          email: credentials.email,
          firstName: credentials.firstName ?? '',
          role,
        });

        await acceptConsents({
          userId: authData.user.id,
          policyVersions: consents,
          userAgent: navigator.userAgent,
        });
      }

      return authData;
    },
    onSuccess: (data) => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
