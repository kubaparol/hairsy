import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { authKeys } from '../query-keys';

/**
 * Hook that listens to Supabase auth state changes and invalidates queries
 *
 * This ensures the app stays in sync with authentication changes like:
 * - Sign in/out
 * - Token refresh
 * - Session expiration
 */
export function useAuthListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] State change:', event, session?.user?.email);

      await queryClient.invalidateQueries({
        queryKey: authKeys.session(),
      });

      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
}
