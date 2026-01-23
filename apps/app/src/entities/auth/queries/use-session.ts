import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { getSession } from '../api';
import { authKeys } from './query-keys';
import type { SupabaseError } from '@/entities/_shared';

type UseSessionOptions = Omit<
  UseQueryOptions<Session | null, SupabaseError>,
  'queryKey' | 'queryFn'
>;

/**
 * Hook to get and subscribe to the current session state.
 *
 * @example
 * ```tsx
 * function AuthStatus() {
 *   const { data: session, isLoading } = useSession();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!session) return <LoginPrompt />;
 *
 *   return <UserMenu user={session.user} />;
 * }
 * ```
 */
export function useSession(options?: UseSessionOptions) {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: getSession,
    // Session should be considered stale quickly for security
    staleTime: 60 * 1000, // 1 minute
    // Don't retry on auth errors - they're usually not transient
    retry: false,
    ...options,
  });
}
