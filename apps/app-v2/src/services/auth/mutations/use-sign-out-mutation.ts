import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@heroui/react';
import { signOut } from '../api/sign-out';

interface UseSignOutMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * React Query mutation hook for signing out the current user.
 *
 * Features:
 * - Signs out from Supabase Auth
 * - Clears all cached data (React Query)
 * - Redirects to sign-in page
 * - Error handling with toast notifications
 *
 * Usage:
 * ```tsx
 * const { mutate: signOut, isPending } = useSignOutMutation();
 * signOut();
 * ```
 */
export function useSignOutMutation(options?: UseSignOutMutationOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      console.log('redirecting to sign-in');
      queryClient.clear();
      options?.onSuccess?.();
      navigate({ to: '/auth/sign-in', search: { redirect: '/' } });
    },
    onError: (error) => {
      console.error('[Auth] Sign out error:', error);

      toast('Wystąpił błąd podczas wylogowywania', {
        variant: 'danger',
        timeout: 5000,
      });

      options?.onError?.(error);
    },
  });
}
