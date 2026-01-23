import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { getUser } from '../api';
import { authKeys } from './query-keys';
import type { SupabaseError } from '@/entities/_shared';

type UseUserOptions = Omit<
  UseQueryOptions<User | null, SupabaseError>,
  'queryKey' | 'queryFn'
>;

/**
 * Hook to get the current authenticated user with server validation.
 *
 * Unlike useSession(), this hook makes a network request to verify
 * the user's session is still valid on the server.
 *
 * @example
 * ```tsx
 * function Profile() {
 *   const { data: user, isLoading, error } = useUser();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!user) return <Navigate to="/login" />;
 *
 *   return <ProfileCard user={user} />;
 * }
 * ```
 */
export function useUser(options?: UseUserOptions) {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: getUser,
    // User verification should be done less frequently
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
}
