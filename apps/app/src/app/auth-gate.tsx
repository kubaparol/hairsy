import { RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/entities/auth';
import { router } from './router';

import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/core/supabase';
import { authKeys } from '@/entities/auth';

export interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * AuthGate bridges React Query session state with TanStack Router context.
 * It must be rendered inside QueryClientProvider.
 */
export function AuthGate() {
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSession();

  const auth: AuthState = {
    session: session ?? null,
    isAuthenticated: !!session,
    isLoading,
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      router.invalidate();
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}
