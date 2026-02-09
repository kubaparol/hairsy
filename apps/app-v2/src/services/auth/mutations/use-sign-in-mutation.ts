import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@heroui/react';
import { signIn } from '../api/sign-in';
import type { SignInParams, SignInResult } from '../api/sign-in';
import { isAppError } from '../../errors';
import { authKeys } from '../query-keys';
import { getRoleBasedDashboard } from '../../../lib/auth-utils';

interface UseSignInMutationOptions {
  onSuccess?: (data: SignInResult) => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

/**
 * React Query mutation hook for user sign-in.
 *
 * Features:
 * - Authenticates with Supabase
 * - Invalidates auth queries to refresh session state
 * - Redirects to appropriate dashboard based on user role
 * - Supports custom redirect via redirectTo option
 * - AppError-aware error handling with Polish messages
 *
 * Usage:
 * ```tsx
 * const { mutate, isPending } = useSignInMutation({
 *   redirectTo: '/business/calendar', // optional
 * });
 * mutate({ email, password });
 * ```
 */
export function useSignInMutation(options?: UseSignInMutationOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SignInParams) => signIn(params),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: authKeys.session() });
      options?.onSuccess?.(data);

      if (options?.redirectTo) {
        navigate({ to: options.redirectTo });
      } else {
        const dashboard = getRoleBasedDashboard(data.profile.role);
        navigate({ to: dashboard });
      }
    },
    onError: (error) => {
      const message = isAppError(error)
        ? error.message
        : 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie';

      toast(message, { variant: 'danger', timeout: 5000 });
      options?.onError?.(error);
    },
  });
}
