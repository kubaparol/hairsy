import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn, type SignInCredentials } from '../api';
import { authKeys } from '../queries/query-keys';
import type { SupabaseError } from '@/entities/_shared';
import type { AuthTokenResponsePassword } from '@supabase/supabase-js';

export interface UseSignInOptions {
  onSuccess?: (data: AuthTokenResponsePassword['data']) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for signing in a user with email and password.
 *
 * Automatically invalidates auth queries on success.
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { mutate: login, isPending, error } = useSignIn({
 *     onSuccess: () => navigate('/dashboard'),
 *   });
 *
 *   const handleSubmit = (e: FormEvent) => {
 *     e.preventDefault();
 *     login({ email, password });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <Alert>{error.message}</Alert>}
 *       <Button loading={isPending}>Sign In</Button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useSignIn(options?: UseSignInOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    AuthTokenResponsePassword['data'],
    SupabaseError,
    SignInCredentials
  >({
    mutationFn: signIn,
    onSuccess: async (data) => {
      // Invalidate all auth queries to refresh state
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
      await options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
