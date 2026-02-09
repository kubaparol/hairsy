import { useQuery } from '@tanstack/react-query';
import { authKeys } from '../query-keys';
import { getSession } from '../api/get-session';
import type { AuthState } from '../../../lib/auth-types';

/**
 * React Query hook to access current authentication state.
 *
 * Fetches and caches the current user session and profile.
 * Automatically refetches on window focus to keep session fresh.
 *
 * Features:
 * - Caches auth state for 5 minutes
 * - Refetches when user returns to tab
 * - Retries once on failure
 * - Returns loading, error, and authenticated states
 *
 * Usage:
 * ```tsx
 * const auth = useAuthQuery();
 *
 * if (auth.isLoading) return <Spinner />;
 * if (!auth.isAuthenticated) return <SignIn />;
 *
 * return <Dashboard user={auth.user} profile={auth.profile} />;
 * ```
 *
 * @returns AuthState with user, profile, loading state, authentication status, and error
 */
export function useAuthQuery(): AuthState & { error: Error | null } {
  const { data, isLoading, error } = useQuery({
    queryKey: authKeys.session(),
    queryFn: getSession,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: true, // Check session when user returns to tab
    retry: 1, // Retry once on failure
  });

  if (isLoading) {
    return {
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,
    };
  }

  if (error) {
    return {
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      error: error as Error,
    };
  }

  return {
    ...data!,
    error: null,
  };
}
