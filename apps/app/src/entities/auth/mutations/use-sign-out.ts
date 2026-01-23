import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut, type SignOutOptions } from '../api';
import type { SupabaseError } from '@/entities/_shared';

export interface UseSignOutOptions {
  onSuccess?: () => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for signing out the current user.
 *
 * Automatically clears all auth queries and removes cached user data.
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const { mutate: logout, isPending } = useSignOut({
 *     onSuccess: () => navigate('/login'),
 *   });
 *
 *   return (
 *     <Button onClick={() => logout()} loading={isPending}>
 *       Sign Out
 *     </Button>
 *   );
 * }
 *
 * // Sign out from all devices
 * function LogoutEverywhereButton() {
 *   const { mutate: logout } = useSignOut();
 *
 *   return (
 *     <Button onClick={() => logout({ scope: 'global' })}>
 *       Sign Out Everywhere
 *     </Button>
 *   );
 * }
 * ```
 */
export function useSignOut(options?: UseSignOutOptions) {
  const queryClient = useQueryClient();

  return useMutation<void, SupabaseError, SignOutOptions | void>({
    mutationFn: (signOutOptions) => signOut(signOutOptions ?? undefined),
    onSuccess: async () => {
      // Clear all cached data on sign out for security
      queryClient.clear();
      await options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
