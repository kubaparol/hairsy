import { RouterProvider } from '@tanstack/react-router';
import { useAuthQuery } from '../services/auth/queries/use-auth-query';
import { useAuthListener } from '../services/auth/hooks/use-auth-listener';
import { router } from '../router';
import { Spinner } from '@heroui/react';

/**
 * Wrapper component that provides authentication state to the router
 *
 * - Fetches current auth state
 * - Shows loading spinner during initial auth check
 * - Passes auth state to router context for use in route guards
 * - Listens for auth state changes from Supabase
 */
export function RouterAuthProvider() {
  const auth = useAuthQuery();
  useAuthListener();

  // Show loading spinner during initial auth check
  if (auth.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  // Pass auth state to router context
  return <RouterProvider router={router} context={{ auth }} />;
}
