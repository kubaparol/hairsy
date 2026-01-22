import { QueryProvider } from '@/lib/query-provider';
import {
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { supabase } from '@/kernel/db/supabase-client';
import { AppRoutes } from '@/ipc/routes';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <QueryProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </QueryProvider>
    </>
  ),
});

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: () => <Outlet />,
});

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected-layout',
  beforeLoad: async ({ location }) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!session || error) {
      throw redirect({
        to: AppRoutes.LOGIN,
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: () => <Outlet />,
});

export { rootRoute, publicLayoutRoute, protectedLayoutRoute };
